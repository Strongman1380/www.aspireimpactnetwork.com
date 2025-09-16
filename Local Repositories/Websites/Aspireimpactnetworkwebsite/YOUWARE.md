# Aspire Impact Network - Membership Platform

## Project Overview
A comprehensive membership platform for Aspire Impact Network with dedicated pages for each membership tier. Features three tiers (Basic, Premier, Professional) with detailed individual pages and real contact information.

## Architecture
- **Frontend**: Multi-page HTML application with vanilla JavaScript and Stripe integration
- **Backend**: Supabase with PostgreSQL database, Row Level Security, and real-time capabilities
- **Payment Processing**: Live Stripe integration with subscription management
- **Email System**: Automated email notifications with customizable templates
- **Admin Tools**: Comprehensive admin dashboard for customer and subscription management
- **Styling**: Light theme with increased spacing, larger fonts, and enhanced accessibility
- **Branding**: Consistent with Aspire Impact Network branding across all pages

## Design Philosophy
- Generous spacing and padding throughout for easy reading
- Larger fonts and clickable areas for better accessibility
- High contrast colors for readability
- Clean typography with increased line height
- Professional service card presentation with enhanced spacing
- Unique visual identity for each membership tier

## Key Features
- Three membership tiers with dedicated landing pages:
  - Basic ($15/mo, $135/year): Interactive worksheets, family presentations, parenting suggestions
  - Premier ($19.99/mo, $179.91/year): Provider-based content, IOP groups, professional resources
  - Elite ($35/mo, $315/year): AI integration with social work, specialized GPT solutions
- Individual detailed pages for each membership tier
- Monthly and yearly billing display with larger, easier-to-use pricing toggle
- Resource cards with increased spacing and tier-based access indicators
- Fully responsive design optimized for all devices with larger touch targets
- Professional navigation with enhanced spacing and contrast
- Real contact information with clear formatting

## File Structure
- `index.html` - Main homepage with membership overview and "Learn More" buttons
- `basic-membership.html` - Detailed Basic Membership page
- `premier-membership.html` - Detailed Premier Membership page
- `../aspire-digital-solutions.html` - Digital Services details page
- `basic-signup.html` - Live Stripe payment form for Basic tier
- `premier-signup.html` - Live Stripe payment form for Premier tier  
- `digital-services-signup.html` - Signup for Digital Services (free trial)
- `signup-confirmation.html` - Payment confirmation with customer details
- `member-dashboard.html` - Customer dashboard with real Supabase data
- `subscription-management.html` - Customer subscription upgrade/downgrade/cancel
- `support-ticket.html` - Customer support ticket submission system
- `admin-dashboard.html` - Administrative interface for managing platform
- `email-templates.js` - Email notification system with HTML templates
- `assets/images/` - Contains all images for the site
- `assets/css/` - Contains vendor CSS files

## Page-Specific Features

### Basic Membership Page
- **Theme**: Individual and family focused with green gradient
- **Features**: Interactive worksheets, family presentations, parenting guidance
- **Design**: Clean, accessible layout with emphasis on personal growth
- **Pricing**: $15/month prominently displayed

### Premier Membership Page
- **Theme**: Professional provider focus with "Most Popular" badge
- **Features**: IOP groups, professional articles, provider-based content
- **Design**: Enhanced professional styling with featured elements
- **Pricing**: $19.99/month with professional benefits highlighted

### Elite Membership Page
- **Theme**: AI-powered innovation with futuristic design elements
- **Features**: AI integration, custom GPT solutions, specialized AI requests
- **Design**: Advanced styling with AI-themed colors and animations
- **Pricing**: $150/month for Digital Services

## Contact Information
- **Email**: brandon.hinrichs@aspireimpactnetwork.com
- **Phone**: (402) 759-2210
- **Address**: 320 S 12th St, Geneva, NE

## Navigation Structure
- All pages link back to main homepage
- Membership cards on homepage link to respective detailed pages
- Consistent navigation across all pages
- Mobile-responsive menu system

## Completed Setup
1. ✅ Multi-page website structure implemented
2. ✅ Individual membership tier pages created
3. ✅ High-contrast, readable design implemented across all pages
4. ✅ Responsive layout for all devices with improved touch targets
5. ✅ Interactive billing toggle functionality on main page
6. ✅ Professional typography with increased font sizes
7. ✅ Real contact information integrated on all pages
8. ✅ Cross-page navigation and linking implemented

## Design Implementation
1. ✅ Light color scheme with enhanced contrast for maximum readability
2. ✅ Professional typography with larger fonts and better spacing
3. ✅ Tier-specific color schemes and visual identity
4. ✅ Clean service card layout with generous padding and spacing
5. ✅ Enhanced shadow effects for visual depth
6. ✅ Mobile-responsive design maintaining readability and accessibility
7. ✅ AI-themed design elements for Professional tier
8. ✅ Professional provider styling for Premier tier

## Functionality
- **Live Payment Processing**: Real Stripe integration with secure checkout forms
- **Customer Management**: Full customer database with subscription tracking
- **Subscription Management**: Customer self-service upgrade/downgrade/cancellation
- **Support System**: Customer support ticket creation and tracking
- **Email Notifications**: Automated welcome, payment, and support emails
- **Admin Dashboard**: Complete administrative interface with analytics
- **Cross-Page Navigation**: Seamless linking between main page and tier pages
- **Responsive Design**: Works seamlessly across all device sizes with improved accessibility
- **Tier-Specific Features**: Each page highlights unique benefits and features
- **Security**: Row Level Security (RLS) policies protecting all customer data
- **Real-time Updates**: Live data synchronization across all components

## Advanced Features Implemented
1. ✅ **Payment Processing**: Live Stripe integration with customer billing
2. ✅ **Customer Database**: Supabase backend with secure data management
3. ✅ **Subscription Management**: Self-service upgrade/downgrade/cancellation
4. ✅ **Email Notifications**: Automated email system for all customer interactions
5. ✅ **Support System**: Customer support ticket creation and tracking
6. ✅ **Admin Dashboard**: Complete administrative interface with:
   - Customer management and analytics
   - Subscription change request approval
   - Support ticket management
   - Revenue analytics and reporting
   - Bulk operations and newsletter functionality
7. ✅ **Security Implementation**: Row Level Security policies on all data
8. ✅ **Activity Logging**: Comprehensive audit trail for all customer actions

## Database Structure
- **customers**: Customer accounts with subscription status and billing info
- **subscriptions**: Detailed subscription tracking with Stripe integration
- **payments**: Payment history and transaction records
- **subscription_tiers**: Plan definitions with pricing and features
- **subscription_changes**: Customer upgrade/downgrade/cancellation requests
- **email_notifications**: Email queue with templates and delivery status
- **support_tickets**: Customer support ticket system with priority and categories
- **admin_users**: Administrative user management with role-based permissions
- **activity_logs**: Comprehensive audit trail for all system activities

## Email System Features
- **Welcome emails** with tier-specific content
- **Payment confirmation** emails with transaction details
- **Subscription change** notifications
- **Support ticket** creation and updates
- **Newsletter broadcasting** to all active customers
- **HTML email templates** with responsive design
- **Email queue processing** with delivery status tracking

## Admin Dashboard Capabilities
- **Customer Overview**: Total customers, revenue, subscription analytics
- **Customer Management**: Search, filter, edit, and email customers
- **Subscription Control**: Approve/reject plan changes, manage billing
- **Support Queue**: Handle customer support tickets with priority system
- **Analytics Dashboard**: Revenue charts and performance metrics
- **Bulk Operations**: Newsletter sending and mass customer management

## Security & Compliance
- **Row Level Security (RLS)**: Customers can only access their own data
- **Secure Payment Processing**: PCI-compliant Stripe integration
- **Admin Role Management**: Different permission levels for staff
- **Activity Logging**: Complete audit trail for compliance
- **Data Protection**: Encrypted data storage and secure API access

## Next Steps for Further Enhancement
1. SMS notifications for critical updates
2. Advanced analytics and reporting dashboard
3. Customer referral program integration
4. Content management system for resources
5. Mobile app development
6. API integrations for third-party services
7. Advanced AI features for Elite tier
8. Multi-language support

This file provides guidance to YOUWARE Agent (youware.com) when working with code in this repository.
