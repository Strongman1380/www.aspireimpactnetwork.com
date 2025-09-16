// Email Configuration for Aspire Impact Network
// This file contains configuration for email services

// EmailJS Configuration
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/
// 2. Create an account and service
// 3. Create an email template
// 4. Replace the values below with your actual EmailJS credentials

const EMAIL_CONFIG = {
    // EmailJS Configuration
    emailjs: {
        serviceId: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        templateId: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        publicKey: 'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
    },
    
    // Formspree Configuration (fallback)
    formspree: {
        endpoint: 'https://formspree.io/f/YOUR_FORM_ID' // Replace with your Formspree form ID
    },
    
    // Default recipient
    recipient: 'brandon.hinrichs@aspireimpactnetwork.com'
};

// Initialize EmailJS when the script loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof emailjs !== 'undefined' && EMAIL_CONFIG.emailjs.publicKey !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAIL_CONFIG.emailjs.publicKey);
        console.log('EmailJS initialized successfully');
    }
});

// Export configuration for use in other scripts
window.EMAIL_CONFIG = EMAIL_CONFIG;