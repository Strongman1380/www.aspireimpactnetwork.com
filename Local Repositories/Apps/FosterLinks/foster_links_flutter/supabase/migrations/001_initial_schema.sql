-- Enable Row Level Security
ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'worker', 'foster_parent');
CREATE TYPE youth_status AS ENUM ('active', 'inactive', 'pending', 'discharged');

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'foster_parent',
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  agency_id TEXT,
  assigned_worker UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Youth table
CREATE TABLE public.youth (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  foster_parent_id UUID REFERENCES public.users(id),
  foster_worker UUID REFERENCES public.users(id),
  medical_info TEXT,
  allergies TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  school_info TEXT,
  case_number TEXT UNIQUE,
  placement_date DATE,
  status youth_status DEFAULT 'active',
  medications TEXT[],
  custom_fields JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Medication logs table
CREATE TABLE public.medication_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  youth_id UUID REFERENCES public.youth(id) ON DELETE CASCADE NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  administered_at TIMESTAMP WITH TIME ZONE NOT NULL,
  administered_by UUID REFERENCES public.users(id) NOT NULL,
  foster_parent_id UUID REFERENCES public.users(id),
  notes TEXT,
  missed BOOLEAN DEFAULT FALSE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Agencies table
CREATE TABLE public.agencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Reports table
CREATE TABLE public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  youth_id UUID REFERENCES public.youth(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_agency ON public.users(agency_id);
CREATE INDEX idx_youth_foster_parent ON public.youth(foster_parent_id);
CREATE INDEX idx_youth_foster_worker ON public.youth(foster_worker);
CREATE INDEX idx_youth_status ON public.youth(status);
CREATE INDEX idx_medication_logs_youth ON public.medication_logs(youth_id);
CREATE INDEX idx_medication_logs_administered_by ON public.medication_logs(administered_by);
CREATE INDEX idx_medication_logs_date ON public.medication_logs(administered_at);
CREATE INDEX idx_reports_created_by ON public.reports(created_by);
CREATE INDEX idx_reports_youth ON public.reports(youth_id);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "Admins have full access to users" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Workers can view users in their agency
CREATE POLICY "Workers can view agency users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role = 'worker'
      AND u.agency_id = users.agency_id
    )
  );

-- Youth policies
CREATE POLICY "Admins have full access to youth" ON public.youth
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Workers can view assigned youth" ON public.youth
  FOR SELECT USING (
    foster_worker = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Foster parents can view their youth" ON public.youth
  FOR SELECT USING (
    foster_parent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Medication logs policies
CREATE POLICY "Admins have full access to medication logs" ON public.medication_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Workers can view medication logs for assigned youth" ON public.medication_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.youth
      WHERE youth.id = medication_logs.youth_id
      AND youth.foster_worker = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Foster parents can manage medication logs for their youth" ON public.medication_logs
  FOR ALL USING (
    foster_parent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Agencies policies (admins only)
CREATE POLICY "Admins have full access to agencies" ON public.agencies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Reports policies
CREATE POLICY "Admins have full access to reports" ON public.reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view their own reports" ON public.reports
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create reports" ON public.reports
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Create functions for updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_youth_updated_at BEFORE UPDATE ON public.youth
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON public.agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
