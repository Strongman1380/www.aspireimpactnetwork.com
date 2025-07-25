// Loading Screen
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);
});

// Particle Animation
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 5 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 25000);
    }
}

// Create particles periodically
setInterval(createParticle, 800);

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Enhanced hover effects for cards
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.feature-card, .resource-card, .testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Floating chat button animation
document.addEventListener('DOMContentLoaded', function() {
    const floatingChat = document.querySelector('.floating-chat');
    if (floatingChat) {
        let chatAnimationDirection = 1;
        
        setInterval(() => {
            const currentTransform = floatingChat.style.transform || 'translateY(0px)';
            const currentY = parseInt(currentTransform.match(/-?\d+/) || 0);
            const newY = currentY + (chatAnimationDirection * 2);
            
            if (Math.abs(newY) > 8) {
                chatAnimationDirection *= -1;
            }
            
            floatingChat.style.transform = `translateY(${newY}px)`;
        }, 100);
    }
});

// Dynamic testimonial rotation
document.addEventListener('DOMContentLoaded', function() {
    let testimonialIndex = 0;
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    function rotateTestimonials() {
        testimonials.forEach((card, index) => {
            card.style.opacity = index === testimonialIndex ? '1' : '0.7';
            card.style.transform = index === testimonialIndex ? 'scale(1.05)' : 'scale(1)';
        });
        testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    }

    if (testimonials.length > 0) {
        setInterval(rotateTestimonials, 4000);
    }
});

// Advanced scroll effects
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.floating-shape');
    const speed = 0.5;

    parallax.forEach(element => {
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
});

// Progressive enhancement for animations
if ('IntersectionObserver' in window) {
    // Advanced scroll-triggered animations
    const advancedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.5
    });

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.feature-card, .resource-card').forEach(el => {
            advancedObserver.observe(el);
        });
    });
}

// Touch-friendly interactions for mobile
if ('ontouchstart' in window) {
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.feature-card, .resource-card, .testimonial-card').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = 'translateY(0) scale(1)';
                }, 150);
            });
        });
    });
}

// Performance optimization: Debounced scroll handler
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    // Any heavy scroll calculations go here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);