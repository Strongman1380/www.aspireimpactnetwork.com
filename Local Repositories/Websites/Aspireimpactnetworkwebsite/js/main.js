// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
});

// Chat Widget Toggle
document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatOptions = document.getElementById('chat-options');
    
    if (chatToggle && chatOptions) {
        chatToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            chatOptions.classList.toggle('active');
        });

        // Close chat options when clicking outside
        document.addEventListener('click', function(event) {
            if (!chatToggle.contains(event.target) && !chatOptions.contains(event.target)) {
                chatOptions.classList.remove('active');
            }
        });
    }
});

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#page') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
});

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.service-card, .contact-details, .contact-image');
    animatedElements.forEach((el, index) => {
        if (el.classList.contains('contact-details')) {
            el.classList.add('slide-in-left');
        } else if (el.classList.contains('contact-image')) {
            el.classList.add('slide-in-right');
        } else {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index * 0.1}s`;
        }
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Form Handling (for contact forms)
function handleFormSubmission(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            const originalText = submitBtn.textContent || submitBtn.value;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Prepare email data
            const emailData = {
                to: 'brandon.hinrichs@aspireimpactnetwork.com',
                subject: `New Contact Form Submission from ${data.firstName || 'Unknown'} ${data.lastName || 'User'}`,
                message: formatEmailMessage(data),
                from: data.email || 'noreply@aspireimpactnetwork.com',
                firstName: data.firstName,
                lastName: data.lastName
            };
            
            // Send email using a service (you'll need to implement this with your preferred email service)
            sendEmail(emailData)
                .then(() => {
                    // Show success message
                    showNotification('Thank you! Your message has been sent successfully.', 'success');
                    
                    // Reset form
                    form.reset();
                })
                .catch((error) => {
                    console.error('Error sending email:', error);
                    showNotification('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
                })
                .finally(() => {
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
}

// Format email message from form data
function formatEmailMessage(data) {
    let message = `New contact form submission:\n\n`;
    message += `Name: ${data.firstName || ''} ${data.lastName || ''}\n`;
    message += `Email: ${data.email || 'Not provided'}\n`;
    message += `Phone: ${data.phone || 'Not provided'}\n`;
    
    if (data.services && Array.isArray(data.services)) {
        message += `Services Interested In: ${data.services.join(', ')}\n`;
    } else if (data.services) {
        message += `Services Interested In: ${data.services}\n`;
    }
    
    if (data.budget) {
        message += `Budget: ${data.budget}\n`;
    }
    
    if (data.hearAbout) {
        message += `How they heard about us: ${data.hearAbout}\n`;
    }
    
    if (data.newsletter) {
        message += `Newsletter signup: Yes\n`;
    }
    
    message += `\nMessage:\n${data.message || 'No message provided'}\n`;
    message += `\n---\nSent from: ${window.location.href}\nTimestamp: ${new Date().toLocaleString()}`;
    
    return message;
}

// Email sending function using EmailJS
async function sendEmail(emailData) {
    try {
        // Check if EmailJS is available
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS not loaded, using fallback method');
            return sendEmailFallback(emailData);
        }
        
        // EmailJS template parameters
        const templateParams = {
            to_email: emailData.to,
            from_name: `${emailData.firstName || ''} ${emailData.lastName || ''}`.trim() || 'Website Visitor',
            from_email: emailData.from,
            subject: emailData.subject,
            message: emailData.message,
            reply_to: emailData.from
        };
        
        // Send email using EmailJS
        const config = window.EMAIL_CONFIG || {};
        const response = await emailjs.send(
            config.emailjs?.serviceId || 'YOUR_SERVICE_ID',
            config.emailjs?.templateId || 'YOUR_TEMPLATE_ID',
            templateParams,
            config.emailjs?.publicKey || 'YOUR_PUBLIC_KEY'
        );
        
        console.log('Email sent successfully:', response);
        return response;
        
    } catch (error) {
        console.error('Error sending email via EmailJS:', error);
        // Fallback to alternative method
        return sendEmailFallback(emailData);
    }
}

// Fallback email method using Formspree or similar service
async function sendEmailFallback(emailData) {
    try {
        // Using Formspree as fallback (you'll need to set up a Formspree endpoint)
        const config = window.EMAIL_CONFIG || {};
        const formspreeEndpoint = config.formspree?.endpoint || 'https://formspree.io/f/YOUR_FORM_ID';
        
        const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailData.from,
                subject: emailData.subject,
                message: emailData.message,
                _replyto: emailData.from,
                _subject: emailData.subject
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Error in fallback email method:', error);
        // Final fallback - create mailto link
        const subject = encodeURIComponent(emailData.subject);
        const body = encodeURIComponent(emailData.message);
        const mailtoLink = `mailto:${emailData.to}?subject=${subject}&body=${body}`;
        
        // Show user a message with mailto link
        showNotification(
            `Please send your message directly to: <a href="${mailtoLink}" style="color: white; text-decoration: underline;">brandon.hinrichs@aspireimpactnetwork.com</a>`, 
            'info'
        );
        
        throw new Error('Email service unavailable - please contact directly');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize form handling for contact forms
document.addEventListener('DOMContentLoaded', function() {
    handleFormSubmission('contact-form');
    handleFormSubmission('contact-form-2');
});

// Lazy Loading for Images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Cart Functionality (Basic)
let cart = JSON.parse(localStorage.getItem('aspire-cart')) || [];

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = `(${cart.length})`;
    }
}

function addToCart(item) {
    cart.push(item);
    localStorage.setItem('aspire-cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Item added to cart!', 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('aspire-cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Item removed from cart!', 'info');
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);

// Performance Optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll event
const debouncedScrollHandler = debounce(function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);