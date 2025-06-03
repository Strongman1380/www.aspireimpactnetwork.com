/**
 * Emergency Banner Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if emergency banner should be shown
    const emergencyBanner = document.createElement('div');
    emergencyBanner.className = 'emergency-banner';
    emergencyBanner.innerHTML = `
        <p>If you're experiencing a crisis, call the National Suicide Prevention Lifeline at <a href="tel:988">988</a> or text HOME to <a href="sms:741741">741741</a></p>
        <button class="emergency-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.insertBefore(emergencyBanner, document.body.firstChild);
    
    // Show banner (in a real implementation, this would be controlled by an admin panel)
    setTimeout(() => {
        emergencyBanner.classList.add('active');
    }, 1000);
    
    // Close button functionality
    const closeButton = emergencyBanner.querySelector('.emergency-close');
    closeButton.addEventListener('click', function() {
        emergencyBanner.classList.remove('active');
        
        // Store in session storage that banner was closed
        sessionStorage.setItem('emergencyBannerClosed', 'true');
    });
    
    // Check if banner was previously closed in this session
    if (sessionStorage.getItem('emergencyBannerClosed') === 'true') {
        emergencyBanner.classList.remove('active');
    }
});