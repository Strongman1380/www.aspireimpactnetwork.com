import * as yup from 'yup';

// Youth Profile Validation Schema
export const youthProfileSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  
  dateOfBirth: yup
    .date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .min(new Date('1900-01-01'), 'Date of birth must be after 1900'),
  
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['Male', 'Female', 'Non-binary', 'Other'], 'Invalid gender selection'),
  
  caseNumber: yup
    .string()
    .matches(/^[A-Z0-9-]+$/, 'Case number must contain only letters, numbers, and hyphens')
    .max(20, 'Case number must be less than 20 characters'),
  
  email: yup
    .string()
    .email('Invalid email format')
    .nullable(),
  
  phone: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
    .nullable(),
  
  notes: yup
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .nullable()
});

// Medication Log Validation Schema
export const medicationLogSchema = yup.object({
  medicationName: yup
    .string()
    .required('Medication name is required')
    .min(2, 'Medication name must be at least 2 characters')
    .max(100, 'Medication name must be less than 100 characters'),
  
  dosage: yup
    .string()
    .required('Dosage is required')
    .matches(/^\d+(\.\d+)?\s*(mg|g|ml|units?)$/i, 'Invalid dosage format (e.g., 10mg, 2.5ml)'),
  
  frequency: yup
    .string()
    .required('Frequency is required')
    .max(50, 'Frequency must be less than 50 characters'),
  
  administeredAt: yup
    .date()
    .required('Administration time is required')
    .max(new Date(), 'Administration time cannot be in the future'),
  
  notes: yup
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .nullable()
});

// User Registration Validation Schema
export const userRegistrationSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['admin', 'worker', 'foster_parent'], 'Invalid role selection'),
  
  agencyId: yup
    .string()
    .when('role', {
      is: (role: string) => role === 'worker' || role === 'admin',
      then: (schema) => schema.required('Agency ID is required for this role'),
      otherwise: (schema) => schema.nullable()
    })
});

// Theme Settings Validation Schema
export const themeSettingsSchema = yup.object({
  mode: yup
    .string()
    .required('Theme mode is required')
    .oneOf(['light', 'dark', 'system'], 'Invalid theme mode'),
  
  primaryColor: yup
    .string()
    .required('Primary color is required')
    .matches(/^#[0-9A-F]{6}$/i, 'Invalid color format (must be hex color)'),
  
  secondaryColor: yup
    .string()
    .required('Secondary color is required')
    .matches(/^#[0-9A-F]{6}$/i, 'Invalid color format (must be hex color)'),
  
  logoUrl: yup
    .string()
    .url('Invalid URL format')
    .nullable(),
  
  logoName: yup
    .string()
    .max(100, 'Logo name must be less than 100 characters')
    .nullable()
});

// Validation helper functions
export const validateField = async (schema: yup.AnySchema, value: any): Promise<string | null> => {
  try {
    await schema.validate(value);
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return 'Validation error';
  }
};

export const validateForm = async (schema: yup.AnySchema, data: any): Promise<Record<string, string>> => {
  try {
    await schema.validate(data, { abortEarly: false });
    return {};
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return errors;
    }
    return { general: 'Validation failed' };
  }
};

// Custom validation rules
export const customValidations = {
  isAdult: (birthDate: Date): boolean => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  },
  
  isValidCaseNumber: (caseNumber: string): boolean => {
    // Custom business logic for case number validation
    return /^CASE-\d{4}-[A-Z]{2}$/.test(caseNumber);
  },
  
  isBusinessHours: (date: Date): boolean => {
    const hour = date.getHours();
    const day = date.getDay();
    return day >= 1 && day <= 5 && hour >= 8 && hour <= 17;
  }
};