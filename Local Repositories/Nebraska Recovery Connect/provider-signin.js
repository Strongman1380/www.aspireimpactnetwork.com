// DOM elements
const signinForm = document.getElementById('signin-form');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

// Initialize the page
function init() {
    // Set up event listeners
    signinForm.addEventListener('submit', handleSignin);
    
    // Setup forgot password link
    document.querySelector('.forgot-password a').addEventListener('click', handleForgotPassword);
    
    // Initialize mock providers if none exist
    initializeMockData();
    
    // Check if user is already logged in
    const currentProvider = JSON.parse(localStorage.getItem('currentProvider'));
    if (currentProvider) {
        // Auto-redirect to dashboard if already logged in
        window.location.href = 'provider-dashboard.html';
    }
}

// Initialize mock data if none exists
function initializeMockData() {
    // Check if mock providers exist
    const mockProviders = JSON.parse(localStorage.getItem('mockProviders')) || [];
    
    // If no providers exist, create some sample data
    if (mockProviders.length === 0) {
        // Create sample providers
        const sampleProviders = [
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'Password123',
                agencyName: 'Example Treatment Center',
                jobTitle: 'Director',
                workPhone: '(402) 555-1234',
                isVerifiedByAdmin: true,
                emailVerifiedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                facilities: [35, 36] // IDs of managed facilities
            },
            {
                id: 2,
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                password: 'Password123',
                agencyName: 'Community Health Services',
                jobTitle: 'Administrator',
                workPhone: '(402) 555-5678',
                isVerifiedByAdmin: true,
                emailVerifiedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                facilities: [18, 19] // IDs of managed facilities
            }
        ];
        
        // Save to localStorage
        localStorage.setItem('mockProviders', JSON.stringify(sampleProviders));
    }
}

// Handle form submission
function handleSignin(e) {
    e.preventDefault();
    
    // Reset messages
    hideMessages();
    
    // Get form data
    const email = document.getElementById('email').value.toLowerCase();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Validate required fields
    if (!email || !password) {
        showError('Please enter both email and password.');
        return;
    }
    
    // Get providers from local storage
    const mockProviders = JSON.parse(localStorage.getItem('mockProviders')) || [];
    
    // Find provider with matching credentials
    const provider = mockProviders.find(p => p.email === email && p.password === password);
    
    if (!provider) {
        showError('Invalid email or password. Please try again.');
        return;
    }
    
    // Check if provider is verified
    if (!provider.isVerifiedByAdmin) {
        showError('Your account is pending approval. Please contact the administrator.');
        return;
    }
    
    // Authentication successful
    
    // Create a session (store provider info without sensitive data)
    const providerSession = {
        id: provider.id,
        firstName: provider.firstName,
        lastName: provider.lastName,
        email: provider.email,
        agencyName: provider.agencyName,
        jobTitle: provider.jobTitle,
        workPhone: provider.workPhone,
        facilities: provider.facilities,
        // Don't include password in the session
        isVerifiedByAdmin: provider.isVerifiedByAdmin,
        emailVerifiedAt: provider.emailVerifiedAt
    };
    
    // Store in localStorage (in a real app, this would be a secure server-side session or JWT)
    localStorage.setItem('currentProvider', JSON.stringify(providerSession));
    
    // Show success message
    showSuccess('Sign-in successful! Redirecting to your dashboard...');
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'provider-dashboard.html';
    }, 1000);
}

// Handle forgot password functionality
function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = prompt('Please enter your email address to reset your password:');
    
    if (!email) {
        return; // User cancelled
    }
    
    // In a real app, this would send an email with a password reset link
    // For our prototype, just show a success message
    
    showSuccess('Password reset instructions have been sent to your email. Please check your inbox.');
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
}

// Show success message
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

// Hide messages
function hideMessages() {
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
}

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);