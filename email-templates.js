// Email notification system for Aspire Impact Network
// This file contains email templates and notification functions

// ⚠️ SECURITY WARNING: API keys should be stored in environment variables
// Initialize Supabase (to be included in pages that use these functions)
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key-here';

// For client-side usage, create a config file that loads from environment
// Example: const config = { supabaseUrl: process.env.SUPABASE_URL, supabaseKey: process.env.SUPABASE_ANON_KEY };

// Email templates
const emailTemplates = {
    welcome: {
        subject: 'Welcome to Aspire Impact Network!',
        getContent: (customerName, tier) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                <div style="background: linear-gradient(135deg, #2c5f41, #4a9960); padding: 40px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
                    <h1 style="color: white; margin: 0; font-size: 2.5rem;">Welcome to Aspire Impact Network!</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 1.2rem;">Your journey to meaningful impact starts here</p>
                </div>
                
                <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <h2 style="color: #2c5f41; margin-bottom: 20px;">Hello ${customerName}!</h2>
                    
                    <p style="font-size: 1.1rem; line-height: 1.6; color: #495057; margin-bottom: 25px;">
                        Thank you for joining our community with the <strong>${tier.charAt(0).toUpperCase() + tier.slice(1)} Membership</strong>. 
                        We're excited to support you on your journey with our comprehensive resources and tools.
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
                        <h3 style="color: #2c5f41; margin-bottom: 15px;">What's Next?</h3>
                        <ul style="color: #495057; line-height: 1.8;">
                            <li>Access your member dashboard to explore available resources</li>
                            <li>Browse your tier-specific content and tools</li>
                            <li>Join our community forums to connect with other members</li>
                            <li>Contact our support team if you have any questions</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://aspireimpactnetwork.com/member-dashboard.html" 
                           style="background: #4a9960; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                            Access Your Dashboard
                        </a>
                    </div>
                    
                    <div style="border-top: 2px solid #e9ecef; padding-top: 25px; margin-top: 30px;">
                        <h3 style="color: #2c5f41; margin-bottom: 15px;">Need Help?</h3>
                        <p style="color: #495057; margin-bottom: 15px;">Our support team is here to help you get the most out of your membership.</p>
                        <p style="color: #495057;">
                            📧 Email: <a href="mailto:brandon.hinrichs@aspireimpactnetwork.com" style="color: #4a9960;">brandon.hinrichs@aspireimpactnetwork.com</a><br>
                            📞 Phone: <a href="tel:+14027592210" style="color: #4a9960;">(402) 759-2210</a>
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 0.9rem;">
                    <p>© 2025 Aspire Impact Network. All rights reserved.</p>
                    <p>320 S 12th St, Geneva, NE</p>
                </div>
            </div>
        `
    },
    
    payment_success: {
        subject: 'Payment Confirmation - Aspire Impact Network',
        getContent: (customerName, amount, tier, billingCycle) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                <div style="background: #27ae60; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
                    <h1 style="color: white; margin: 0; font-size: 2rem;">Payment Successful ✅</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your subscription has been renewed</p>
                </div>
                
                <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <h2 style="color: #2c5f41; margin-bottom: 20px;">Hello ${customerName},</h2>
                    
                    <p style="font-size: 1.1rem; line-height: 1.6; color: #495057; margin-bottom: 25px;">
                        Your payment has been successfully processed. Thank you for continuing your membership with us!
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
                        <h3 style="color: #2c5f41; margin-bottom: 15px;">Payment Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="border-bottom: 1px solid #e9ecef;">
                                <td style="padding: 10px 0; color: #495057; font-weight: 600;">Plan:</td>
                                <td style="padding: 10px 0; color: #2c5f41; font-weight: 600;">${tier.charAt(0).toUpperCase() + tier.slice(1)} Membership</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e9ecef;">
                                <td style="padding: 10px 0; color: #495057; font-weight: 600;">Billing Cycle:</td>
                                <td style="padding: 10px 0; color: #2c5f41;">${billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #495057; font-weight: 600;">Amount Paid:</td>
                                <td style="padding: 10px 0; color: #27ae60; font-weight: 700; font-size: 1.2rem;">$${(amount / 100).toFixed(2)}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://aspireimpactnetwork.com/member-dashboard.html" 
                           style="background: #4a9960; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                            View Your Account
                        </a>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 0.9rem;">
                    <p>© 2025 Aspire Impact Network. All rights reserved.</p>
                </div>
            </div>
        `
    },
    
    subscription_updated: {
        subject: 'Subscription Update Confirmation',
        getContent: (customerName, oldTier, newTier, changeType) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
                    <h1 style="color: white; margin: 0; font-size: 2rem;">Subscription ${changeType.charAt(0).toUpperCase() + changeType.slice(1)} Complete</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your membership has been updated</p>
                </div>
                
                <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <h2 style="color: #2c5f41; margin-bottom: 20px;">Hello ${customerName},</h2>
                    
                    <p style="font-size: 1.1rem; line-height: 1.6; color: #495057; margin-bottom: 25px;">
                        Your subscription ${changeType} has been successfully processed. Your new membership benefits are now active.
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
                        <h3 style="color: #2c5f41; margin-bottom: 15px;">Subscription Change</h3>
                        <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                            <div style="text-align: center;">
                                <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                                    <strong style="color: #495057;">${oldTier.charAt(0).toUpperCase() + oldTier.slice(1)}</strong>
                                </div>
                                <small style="color: #6c757d;">Previous Plan</small>
                            </div>
                            <div style="font-size: 1.5rem; color: #4a9960;">→</div>
                            <div style="text-align: center;">
                                <div style="background: #4a9960; color: white; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                                    <strong>${newTier.charAt(0).toUpperCase() + newTier.slice(1)}</strong>
                                </div>
                                <small style="color: #6c757d;">New Plan</small>
                            </div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://aspireimpactnetwork.com/member-dashboard.html" 
                           style="background: #4a9960; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                            Explore Your New Benefits
                        </a>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 0.9rem;">
                    <p>© 2025 Aspire Impact Network. All rights reserved.</p>
                </div>
            </div>
        `
    },
    
    support_ticket_created: {
        subject: 'Support Ticket Created - We\'re Here to Help',
        getContent: (customerName, ticketId, subject) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                <div style="background: #3498db; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
                    <h1 style="color: white; margin: 0; font-size: 2rem;">Support Ticket Created 🎫</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">We're here to help you</p>
                </div>
                
                <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <h2 style="color: #2c5f41; margin-bottom: 20px;">Hello ${customerName},</h2>
                    
                    <p style="font-size: 1.1rem; line-height: 1.6; color: #495057; margin-bottom: 25px;">
                        Thank you for contacting our support team. Your ticket has been created and our team will review your request shortly.
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
                        <h3 style="color: #2c5f41; margin-bottom: 15px;">Ticket Information</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="border-bottom: 1px solid #e9ecef;">
                                <td style="padding: 10px 0; color: #495057; font-weight: 600;">Ticket ID:</td>
                                <td style="padding: 10px 0; color: #2c5f41; font-weight: 600;">#${ticketId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #495057; font-weight: 600;">Subject:</td>
                                <td style="padding: 10px 0; color: #2c5f41;">${subject}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background: #e8f5e8; border-left: 4px solid #27ae60; padding: 20px; margin: 25px 0;">
                        <h4 style="color: #27ae60; margin-bottom: 10px;">⏱️ Response Time</h4>
                        <p style="color: #495057; margin: 0;">Our team typically responds within 24 hours during business days. For urgent issues, please call us directly.</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <p style="color: #495057; margin-bottom: 15px;">Need immediate assistance?</p>
                        <a href="tel:+14027592210" 
                           style="background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin-right: 10px;">
                            📞 Call Support
                        </a>
                        <a href="https://aspireimpactnetwork.com/member-dashboard.html" 
                           style="background: #4a9960; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                            View Dashboard
                        </a>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 0.9rem;">
                    <p>© 2025 Aspire Impact Network. All rights reserved.</p>
                </div>
            </div>
        `
    }
};

// Email notification functions
async function createEmailNotification(customerId, emailType, templateData) {
    const template = emailTemplates[emailType];
    if (!template) {
        console.error('Email template not found:', emailType);
        return false;
    }

    try {
        const subject = template.subject;
        const content = template.getContent(...templateData);

        const { data, error } = await supabase
            .from('email_notifications')
            .insert([
                {
                    customer_id: customerId,
                    email_type: emailType,
                    subject: subject,
                    content: content,
                    status: 'pending'
                }
            ])
            .select()
            .single();

        if (error) throw error;

        console.log('Email notification created:', data.id);
        return data;
    } catch (error) {
        console.error('Error creating email notification:', error);
        return false;
    }
}

// Specific notification functions
async function sendWelcomeEmail(customerId, customerName, tier) {
    return await createEmailNotification(customerId, 'welcome', [customerName, tier]);
}

async function sendPaymentSuccessEmail(customerId, customerName, amount, tier, billingCycle) {
    return await createEmailNotification(customerId, 'payment_success', [customerName, amount, tier, billingCycle]);
}

async function sendSubscriptionUpdateEmail(customerId, customerName, oldTier, newTier, changeType) {
    return await createEmailNotification(customerId, 'subscription_updated', [customerName, oldTier, newTier, changeType]);
}

async function sendSupportTicketEmail(customerId, customerName, ticketId, subject) {
    return await createEmailNotification(customerId, 'support_ticket_created', [customerName, ticketId, subject]);
}

// Batch email functions
async function sendNewsletterToAllCustomers(subject, content) {
    try {
        const { data: customers, error } = await supabase
            .from('customers')
            .select('id, email, full_name')
            .eq('subscription_status', 'active');

        if (error) throw error;

        const notifications = customers.map(customer => ({
            customer_id: customer.id,
            email_type: 'newsletter',
            subject: subject,
            content: content,
            status: 'pending'
        }));

        const { data, error: insertError } = await supabase
            .from('email_notifications')
            .insert(notifications);

        if (insertError) throw insertError;

        console.log(`Newsletter scheduled for ${customers.length} customers`);
        return true;
    } catch (error) {
        console.error('Error sending newsletter:', error);
        return false;
    }
}

// Email queue processing (for demonstration)
async function processEmailQueue() {
    try {
        const { data: pendingEmails, error } = await supabase
            .from('email_notifications')
            .select('*')
            .eq('status', 'pending')
            .limit(10);

        if (error) throw error;

        for (const email of pendingEmails) {
            // In a real implementation, this would actually send the email
            // For now, we'll just mark it as sent
            console.log(`Processing email: ${email.subject} to customer ${email.customer_id}`);
            
            await supabase
                .from('email_notifications')
                .update({ 
                    status: 'sent', 
                    sent_at: new Date().toISOString() 
                })
                .eq('id', email.id);
        }

        console.log(`Processed ${pendingEmails.length} emails`);
    } catch (error) {
        console.error('Error processing email queue:', error);
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendWelcomeEmail,
        sendPaymentSuccessEmail,
        sendSubscriptionUpdateEmail,
        sendSupportTicketEmail,
        sendNewsletterToAllCustomers,
        processEmailQueue,
        createEmailNotification
    };
}