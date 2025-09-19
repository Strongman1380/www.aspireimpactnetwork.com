# Deployment Guide
## Aspire Impact Network Membership Site

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended for Frontend + API)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   # From the membership site root directory
   vercel --prod
   ```

3. **Deploy API** (create separate project):
   ```bash
   cd api
   vercel --prod
   ```

4. **Set Environment Variables** in Vercel dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Option 2: Netlify (Frontend) + Heroku (API)

#### Frontend on Netlify:
1. Connect your GitHub repo to Netlify
2. Set build command: `# No build needed for static site`
3. Set publish directory: `./`

#### API on Heroku:
1. **Create Heroku app**:
   ```bash
   cd api
   heroku create aspire-impact-api
   ```

2. **Set environment variables**:
   ```bash
   heroku config:set STRIPE_SECRET_KEY=sk_live_...
   heroku config:set STRIPE_WEBHOOK_SECRET=whsec_...
   heroku config:set SUPABASE_URL=https://vpxejnebrnwjlnokfkgu.supabase.co
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=...
   ```

3. **Deploy**:
   ```bash
   git add .
   git commit -m "Initial API deployment"
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

1. **Create new app** from GitHub repo
2. **Configure build settings**:
   - Build command: `cd api && npm install`
   - Run command: `cd api && npm start`
3. **Set environment variables** in dashboard
4. **Deploy**

## 🔧 Configuration Updates After Deployment

### 1. Update Frontend API URLs

In `assets/js/stripe-service.js`, replace the `callBackendAPI` method:

```javascript
async callBackendAPI(endpoint, options = {}) {
    const baseUrl = 'https://your-api-domain.com'; // Your deployed API URL
    const url = `${baseUrl}${endpoint}`;
    
    // Remove the simulation code and use real fetch
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    
    return response;
}
```

### 2. Configure Stripe Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Create new endpoint: `https://your-api-domain.com/api/webhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to your environment variables

### 3. Update CORS Settings

In your deployed API, update CORS origin:

```javascript
app.use(cors({
    origin: 'https://your-frontend-domain.com', // Your deployed frontend URL
    credentials: true
}));
```

## 📊 Database Setup

### Supabase Tables

Ensure these tables exist in your Supabase database:

```sql
-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    subscription_tier TEXT DEFAULT 'basic',
    billing_cycle TEXT DEFAULT 'monthly',
    subscription_status TEXT DEFAULT 'active',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_invoice_id TEXT,
    stripe_customer_id TEXT,
    customer_id UUID REFERENCES customers(id),
    amount INTEGER,
    currency TEXT DEFAULT 'usd',
    status TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_customer_id ON customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_subscription_id ON customers(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer_id ON support_tickets(customer_id);
```

## 🔒 Security Checklist

- [ ] All environment variables set correctly
- [ ] HTTPS enabled on all domains
- [ ] CORS configured properly
- [ ] Webhook signatures verified
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Database RLS (Row Level Security) enabled

## 🧪 Testing Your Deployment

### 1. Test Payment Flow
1. Visit your deployed site
2. Try signing up for each membership tier
3. Use Stripe test cards:
   - Success: `4242424242424242`
   - Decline: `4000000000000002`
   - 3D Secure: `4000002500003155`

### 2. Test Webhooks
1. Make a test payment
2. Check Stripe Dashboard → Webhooks for delivery status
3. Verify database updates

### 3. Test Customer Portal
1. Create a test subscription
2. Access customer portal
3. Try updating payment method

## 📈 Monitoring & Analytics

### Recommended Tools
- **Stripe Dashboard**: Payment monitoring
- **Supabase Dashboard**: Database monitoring
- **Vercel Analytics**: Frontend performance
- **Sentry**: Error tracking
- **LogRocket**: User session recording

### Key Metrics to Track
- Conversion rates by membership tier
- Payment success/failure rates
- Customer churn rate
- Support ticket volume
- Page load times

## 🔄 Maintenance

### Regular Tasks
- Monitor webhook delivery success
- Review failed payments
- Update Stripe price IDs if needed
- Backup database regularly
- Update dependencies monthly

### Scaling Considerations
- Add Redis for session management
- Implement database connection pooling
- Add CDN for static assets
- Consider microservices architecture

## 🆘 Troubleshooting

### Common Issues

**Payments not processing:**
- Check Stripe keys are correct
- Verify webhook endpoint is accessible
- Check CORS settings

**Database errors:**
- Verify Supabase connection
- Check table schemas match
- Review RLS policies

**Frontend errors:**
- Check API URLs are correct
- Verify HTTPS is enabled
- Review browser console for errors

### Support Resources
- Stripe Support: https://support.stripe.com
- Supabase Support: https://supabase.com/support
- Deployment platform documentation

---

**🎉 Congratulations!** Your membership site is now ready for production use.