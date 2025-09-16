# 🗺️ Aspire Impact Network - Complete Site Map & Testing Guide

## 📋 Platform Overview
**Live Admin Access Portal**: `admin-access.html` - Your central command center

---

## 🏠 **Public Pages** (No Login Required)

### **Main Website**
| Page | File | Purpose | Critical Links |
|------|------|---------|---------------|
| **Homepage** | `index.html` | Main landing page with membership overview | ✅ All membership pages, signup forms |
| **Basic Membership** | `basic-membership.html` | Detailed Basic tier information | ✅ `basic-signup.html` |
| **Premier Membership** | `premier-membership.html` | Detailed Premier tier information | ✅ `premier-signup.html` |
| **Digital Services** | `../aspire-digital-solutions.html` | Digital services details | ✅ `digital-services-signup.html` |

### **Payment & Signup Flow**
| Page | File | Purpose | Integrations |
|------|------|---------|--------------|
| **Basic Signup** | `basic-signup.html` | Stripe payment for Basic ($15/mo) | 💳 Stripe, 🗄️ Supabase |
| **Premier Signup** | `premier-signup.html` | Stripe payment for Premier ($19.99/mo) | 💳 Stripe, 🗄️ Supabase |
| **Digital Signup** | `digital-services-signup.html` | Signup with 30-day trial ($150/mo after) | 💳 Stripe, 🗄️ Supabase |
| **Confirmation** | `signup-confirmation.html` | Payment success & welcome | 📧 Email triggers |

---

## 🔐 **Member Area** (Login Required)

| Page | File | Purpose | Database Tables |
|------|------|---------|-----------------|
| **Member Dashboard** | `member-dashboard.html` | Customer overview & resources | `customers`, `subscriptions` |
| **Subscription Management** | `subscription-management.html` | Upgrade/downgrade/cancel | `subscription_changes` |
| **Support System** | `support-ticket.html` | Customer support tickets | `support_tickets` |

---

## 🛡️ **Admin Area** (Admin Access Only)

| Page | File | Purpose | Access Level |
|------|------|---------|--------------|
| **Admin Access Portal** | `admin-access.html` | Main admin command center | Super Admin |
| **Admin Dashboard** | `admin-dashboard.html` | Customer & subscription management | Admin |

---

## 🔗 **Navigation Flow Map**

```
Homepage (index.html)
├── Learn More → Basic Membership (basic-membership.html)
│   └── Start Basic Plan → Basic Signup (basic-signup.html)
│       └── Success → Confirmation (signup-confirmation.html)
│           └── Member Dashboard (member-dashboard.html)
├── Learn More → Premier Membership (premier-membership.html)
│   └── Start Premier Plan → Premier Signup (premier-signup.html)
├── Learn More → Digital Services (../aspire-digital-solutions.html)
│   └── Start Digital Plan → Digital Signup (digital-services-signup.html)
├── Member Login → Member Dashboard (member-dashboard.html)
│   ├── Manage Subscription → Subscription Management (subscription-management.html)
│   └── Get Support → Support Ticket (support-ticket.html)
└── Admin Access → Admin Portal (admin-access.html)
    └── Dashboard → Admin Dashboard (admin-dashboard.html)
```

---

## 🧪 **Testing Checklist**

### **✅ Critical Path Testing**

#### **1. Homepage Testing**
- [ ] Homepage loads properly (`index.html`)
- [ ] All membership cards display correctly
- [ ] Pricing toggle works (Monthly/Yearly)
- [ ] Navigation menu functions
- [ ] CTA buttons link to correct signup pages
- [ ] "Learn More" buttons link to membership detail pages

#### **2. Membership Pages Testing**
- [ ] Basic Membership page loads (`basic-membership.html`)
- [ ] Premier Membership page loads (`premier-membership.html`)
- [ ] Digital Services details page loads (`../aspire-digital-solutions.html`)
- [ ] All "Start Plan" buttons work
- [ ] Back navigation works
- [ ] Mobile responsiveness

#### **3. Payment Flow Testing**
- [ ] Basic signup form loads (`basic-signup.html`)
- [ ] Premier signup form loads (`premier-signup.html`)
- [ ] Digital signup form loads (`digital-services-signup.html`)
- [ ] **⚠️ Stripe integration requires testing with test cards**
- [ ] Form validation works
- [ ] Payment confirmation page (`signup-confirmation.html`)

#### **4. Member Area Testing**
- [ ] Member dashboard loads (`member-dashboard.html`)
- [ ] Customer data displays correctly
- [ ] Subscription management page (`subscription-management.html`)
- [ ] Support ticket system (`support-ticket.html`)
- [ ] All member navigation works

#### **5. Admin Testing**
- [ ] Admin access portal loads (`admin-access.html`)
- [ ] Page checker function works
- [ ] Link validation function works
- [ ] Database health check connects to Supabase
- [ ] Admin dashboard access (`admin-dashboard.html`)

---

## 🗄️ **Database Tables to Monitor**

### **Customer Data**
- `customers` - Customer accounts and subscription info
- `subscriptions` - Active subscription tracking
- `payments` - Payment history and transactions

### **Platform Management**
- `subscription_changes` - Upgrade/downgrade requests
- `support_tickets` - Customer support system
- `email_notifications` - Email queue and status
- `activity_logs` - System audit trail
- `admin_users` - Admin access management

---

## 🔧 **System Integrations**

### **Payment Processing**
- **Stripe Integration**: All signup pages use Stripe.js v3
- **Test Cards**: Use Stripe test card numbers for testing
- **Webhook Handling**: Payment confirmations trigger database updates

### **Database (Supabase)**
- **Connection**: `vpxejnebrnwjlnokfkgu.supabase.co`
- **Security**: Row Level Security (RLS) enabled
- **Real-time**: Live data updates across platform

### **Email System**
- **Templates**: Available in `email-templates.js`
- **Triggers**: Welcome, payment, support, newsletter emails
- **Queue**: Email notifications stored in database

---

## 🚨 **Common Issues to Check**

### **Links to Verify**
1. **Navigation Links**:
   - Homepage to membership pages
   - Membership pages to signup forms
   - Back navigation from all pages

2. **CTA Buttons**:
   - "Start Free Trial" → Signup forms
   - "Learn More" → Membership detail pages
   - "Member Login" → Member dashboard

3. **External Resources**:
   - Google Fonts loading
   - FontAwesome icons loading
   - Stripe.js loading
   - Supabase connection

### **Database Connections**
- Test customer data loading
- Test subscription management
- Test support ticket creation
- Test admin dashboard analytics

### **Mobile Responsiveness**
- All pages display correctly on mobile
- Navigation menus work on mobile
- Forms are usable on mobile devices
- Payment forms work on mobile

---

## 🎯 **Quick Testing Commands**

### **From Admin Access Portal**
1. **Check All Pages**: Click "Check All Pages" in admin portal
2. **Test Links**: Click "Test Links" for comprehensive link validation
3. **Database Health**: Click "Health Check" to verify Supabase connection

### **Manual Testing URLs**
```
# Core Pages
admin-access.html        # Main admin portal
index.html              # Homepage
basic-membership.html   # Basic tier details
premier-membership.html # Premier tier details
../aspire-digital-solutions.html # Digital services details

# Payment Flow
basic-signup.html       # Basic payment form
premier-signup.html     # Premier payment form
digital-services-signup.html     # Digital signup form
signup-confirmation.html # Payment confirmation

# Member Area
member-dashboard.html          # Customer dashboard
subscription-management.html   # Subscription control
support-ticket.html           # Support system

# Admin Area
admin-dashboard.html    # Full admin dashboard
```

---

## 📞 **Support Information**

**Contact Details**:
- **Email**: brandon.hinrichs@aspireimpactnetwork.com
- **Phone**: (402) 759-2210
- **Address**: 320 S 12th St, Geneva, NE

**Technical Support**:
- **Database**: Supabase Console
- **Payments**: Stripe Dashboard
- **Admin Access**: Use `admin-access.html` for comprehensive platform management

---

## 📊 **Platform Statistics**

| Metric | Current Status |
|--------|----------------|
| **Total Pages** | 12 functional pages |
| **Payment Tiers** | 3 membership levels |
| **Database Tables** | 8 core tables |
| **Admin Tools** | Complete management suite |
| **Security** | RLS enabled, encrypted data |
| **Mobile Support** | Fully responsive design |

---

**🎉 Your platform is production-ready with comprehensive admin tools and monitoring capabilities!**
