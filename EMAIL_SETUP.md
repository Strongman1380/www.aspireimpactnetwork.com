# Email Setup Instructions for Aspire Impact Network

This document provides instructions for setting up email functionality for the contact forms on the Aspire Impact Network website.

## Current Status

✅ **Completed:**
- Contact forms are responsive and work on all devices
- Calendly consultation links are implemented across the site
- Form validation and user feedback systems are in place
- Email configuration structure is set up

⚠️ **Requires Setup:**
- Email service configuration (EmailJS or Formspree)

## Email Service Options

### Option 1: EmailJS (Recommended)

EmailJS allows you to send emails directly from the client-side without a backend server.

**Setup Steps:**

1. **Create EmailJS Account:**
   - Go to [https://www.emailjs.com/](https://www.emailjs.com/)
   - Sign up for a free account

2. **Create Email Service:**
   - Add an email service (Gmail, Outlook, etc.)
   - Note down your Service ID

3. **Create Email Template:**
   - Create a new email template
   - Use these template variables:
     - `{{to_email}}` - Recipient email
     - `{{from_name}}` - Sender name
     - `{{from_email}}` - Sender email
     - `{{subject}}` - Email subject
     - `{{message}}` - Email message
     - `{{reply_to}}` - Reply-to email
   - Note down your Template ID

4. **Get Public Key:**
   - Go to Account settings
   - Copy your Public Key

5. **Update Configuration:**
   - Open `js/email-config.js`
   - Replace the placeholder values:
     ```javascript
     emailjs: {
         serviceId: 'your_actual_service_id',
         templateId: 'your_actual_template_id',
         publicKey: 'your_actual_public_key'
     }
     ```

### Option 2: Formspree (Alternative)

Formspree is a form backend service that handles form submissions.

**Setup Steps:**

1. **Create Formspree Account:**
   - Go to [https://formspree.io/](https://formspree.io/)
   - Sign up for an account

2. **Create New Form:**
   - Create a new form
   - Set the email to: `brandon.hinrichs@aspireimpactnetwork.com`
   - Note down your Form ID

3. **Update Configuration:**
   - Open `js/email-config.js`
   - Replace the placeholder value:
     ```javascript
     formspree: {
         endpoint: 'https://formspree.io/f/your_actual_form_id'
     }
     ```

## Testing

After setup, test the contact forms by:

1. Opening the contact page
2. Filling out a form
3. Submitting it
4. Checking that the email arrives at `brandon.hinrichs@aspireimpactnetwork.com`

## Fallback Behavior

If email services are not configured, the system will:
1. Try EmailJS first
2. Fall back to Formspree
3. Finally show a mailto link for direct email

## Files Modified

- `contact.html` - Added EmailJS script and Calendly links
- `js/main.js` - Updated form handling with email functionality
- `js/email-config.js` - Email service configuration
- `aspire-digital-solutions.html` - Updated consultation links
- `services.html` - Updated consultation links
- `testimonials.html` - Updated consultation links

## Calendly Integration

The following pages now have Calendly consultation links:
- Contact page: "Schedule Consultation" button
- Services page: "Schedule Consultation" buttons
- Digital Solutions page: "Schedule Consultation" button
- Testimonials page: "Schedule Consultation" button

**Calendly URL:** `https://calendly.com/brandon-hinrichs-aspireimpactnetwork/30min`

## Support

If you need help with the setup, please contact the development team or refer to the documentation for EmailJS or Formspree.