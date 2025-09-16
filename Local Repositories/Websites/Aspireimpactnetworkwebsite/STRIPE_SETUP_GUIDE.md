# Stripe Integration Setup Guide
## Aspire Impact Network Membership Site

This guide will help you complete the Stripe integration for your membership site.

## 🚀 Quick Start

Your site already has:
- ✅ Stripe publishable key configured
- ✅ Supabase database connected
- ✅ Payment forms implemented
- ✅ Frontend Stripe service created

## 📋 What You Need to Complete

### 1. Create Stripe Products and Prices

In your Stripe Dashboard, create these products and prices:

#### Basic Membership
- **Product Name**: Basic Membership
- **Monthly Price ID**: `price_basic_monthly` → $29/month
- **Yearly Price ID**: `price_basic_yearly` → $290/year

#### Premier Membership  
- **Product Name**: Premier Membership
- **Monthly Price ID**: `price_premier_monthly` → $59/month
- **Yearly Price ID**: `price_premier_yearly` → $590/year

#### Professional Membership
- **Product Name**: Professional Membership
- **Monthly Price ID**: `price_professional_monthly` → $99/month
- **Yearly Price ID**: `price_professional_yearly` → $990/year

### 2. Update Price IDs

Replace the placeholder price IDs in `assets/js/stripe-service.js`:

```javascript
// Update these with your actual Stripe price IDs
this.pricing = {
    basic: {
        monthly: {
            priceId: 'price_1234567890', // Replace with actual price ID
            amount: 29,
            display: '$29/month'
        },
        yearly: {
            priceId: 'price_0987654321', // Replace with actual price ID
            amount: 290,
            display: '$290/year <span class="savings">(Save $58)</span>'
        }
    },
    // ... update all tiers
};
```

### 3. Set Up Backend API

Choose one of these options:

#### Option A: Node.js/Express Backend
1. Create a new Node.js project
2. Install dependencies:
   ```bash
   npm install express stripe @supabase/supabase-js cors dotenv
   ```
3. Use the template in `api/stripe-backend.js`
4. Deploy to Heroku, Vercel, or your preferred platform

#### Option B: Serverless Functions
- **Vercel**: Create API routes in `/api/` folder
- **Netlify**: Create functions in `/netlify/functions/` folder
- **AWS Lambda**: Deploy as Lambda functions

#### Option C: PHP Backend
Create PHP endpoints for:
- `/api/create-subscription.php`
- `/api/update-subscription.php`
- `/api/cancel-subscription.php`
- `/api/customer-portal.php`
- `/api/webhook.php`

### 4. Environment Variables

Set these environment variables in your backend:

```env
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
SUPABASE_URL=https://vpxejnebrnwjlnokfkgu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 5. Configure Webhooks

In Stripe Dashboard → Webhooks, create an endpoint:
- **URL**: `https://yourdomain.com/api/webhook`
- **Events to send**:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### 6. Update Database Schema

Ensure your Supabase `customers` table has these columns:

```sql
-- Add these columns if they don't exist
ALTER TABLE customers ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_stripe_customer_id ON customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_subscription_id ON customers(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
```

## 🔧 Configuration Files

### Update Stripe Service Configuration

In `assets/js/stripe-service.js`, update the `callBackendAPI` method to point to your actual backend:

```javascript
async callBackendAPI(endpoint, options = {}) {
    const baseUrl = 'https://your-backend-domain.com'; // Update this
    const url = `${baseUrl}${endpoint}`;
    
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

## 🧪 Testing

### Test Mode Setup
1. Use test publishable key: `pk_test_...`
2. Use test secret key: `sk_test_...`
3. Create test products and prices
4. Use test card numbers:
   - Success: `4242424242424242`
   - Decline: `4000000000000002`
   - 3D Secure: `4000002500003155`

### Production Checklist
- [ ] All price IDs updated with live prices
- [ ] Backend deployed and accessible
- [ ] Webhook endpoint configured and tested
- [ ] Environment variables set correctly
- [ ] SSL certificate installed
- [ ] Error handling tested
- [ ] Email notifications working

## 🎯 Features Included

### Frontend Features
- ✅ Secure card input with Stripe Elements
- ✅ Real-time form validation
- ✅ 3D Secure authentication support
- ✅ Loading states and error handling
- ✅ Responsive design
- ✅ Multiple membership tiers
- ✅ Monthly/yearly billing options

### Backend Features (Template Provided)
- ✅ Subscription creation
- ✅ Subscription updates
- ✅ Subscription cancellation
- ✅ Customer portal access
- ✅ Webhook handling
- ✅ Database integration
- ✅ Error handling

### Customer Dashboard Features
- ✅ Subscription management
- ✅ Billing history
- ✅ Profile updates
- ✅ Support ticket system
- ✅ Customer portal access

## 🔒 Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Validate all data** on the backend
3. **Use HTTPS** for all API endpoints
4. **Verify webhook signatures** to prevent fraud
5. **Implement rate limiting** on API endpoints
6. **Log all transactions** for audit purposes

## 📞 Support

If you need help with the setup:

1. **Stripe Documentation**: https://stripe.com/docs
2. **Supabase Documentation**: https://supabase.com/docs
3. **Test the integration** thoroughly before going live

## 🚀 Going Live

1. Replace test keys with live keys
2. Update all price IDs to live prices
3. Test with small amounts first
4. Monitor webhook deliveries
5. Set up monitoring and alerts

---

**Note**: The current implementation includes a simulation mode for development. Replace the `simulateBackendAPI` method with actual API calls once your backend is deployed.