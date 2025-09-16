---
description: Repository Information Overview
alwaysApply: true
---

# Aspire Impact Network Website Information

## Summary
A modern, responsive website for Aspire Impact Network - a Nebraska-based organization dedicated to bridging the gap between community support services and digital business solutions. The repository contains both the main website and a membership/training site.

## Structure
The repository consists of two main components:
- **Main Website**: HTML/CSS/JS-based responsive website with service information
- **Membership Site**: Training and membership portal with subscription management

### Main Directories
- `/`: Main website HTML files and assets
- `/css/`: Stylesheet files for the main website
- `/js/`: JavaScript files for the main website
- `/images/`: Image assets for the main website
- `/Aspire Impact Network Training:Membership site/`: Membership portal files
- `/Aspire Impact Network Training:Membership site/assets/`: Assets for the membership site

## Projects

### Main Website
**Configuration File**: None (static HTML/CSS/JS)

#### Language & Runtime
**Language**: HTML5, CSS3, JavaScript (ES6+)
**Build System**: None (static site)

#### Dependencies
**Main Dependencies**:
- Google Fonts (Inter)
- Font Awesome icons

#### Build & Installation
```bash
# No build process required - static HTML site
# For development, use a local server
# Example with Python:
python -m http.server
```

### Membership Site
**Configuration File**: `.env.example` (requires copying to `.env` with actual values)

#### Language & Runtime
**Language**: HTML5, CSS3, JavaScript (ES6+)
**External Services**: Supabase, Stripe

#### Dependencies
**Main Dependencies**:
- Supabase (Database and Authentication)
- Stripe (Payment Processing)
- SMTP Email Service

#### Build & Installation
```bash
# No build process required - static HTML site with external service integrations
# Copy .env.example to .env and fill in actual values
cp "Aspire Impact Network Training:Membership site/.env.example" "Aspire Impact Network Training:Membership site/.env"
```

#### Key Resources
**Main Files**:
- `index.html`: Main landing page with membership overview
- `basic-membership.html`, `premier-membership.html`, `professional-membership.html`: Membership tier pages
- `member-dashboard.html`: Customer dashboard for logged-in users
- `admin-dashboard.html`: Admin dashboard for site management
- `email-templates.js`: Email notification templates

**Database Structure**:
- `customers`: Customer accounts and subscription info
- `subscriptions`: Active subscription tracking
- `payments`: Payment history and transactions
- `subscription_changes`: Upgrade/downgrade requests
- `support_tickets`: Customer support system
- `email_notifications`: Email queue and status
- `activity_logs`: System audit trail
- `admin_users`: Admin access management

#### External Integrations
**Payment Processing**:
- Stripe Integration for subscription payments
- Webhook handling for payment confirmations

**Database (Supabase)**:
- Connection to Supabase for data storage
- Row Level Security (RLS) for data protection
- Real-time data updates across platform

**Email System**:
- Templates defined in `email-templates.js`
- SMTP configuration for sending emails
- Triggered emails for welcome, payment, support