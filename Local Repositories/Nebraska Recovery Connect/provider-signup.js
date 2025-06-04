// DOM elements
const signupForm = document.getElementById('signup-form');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

// Mock database for providers (in a real app, this would be server-side)
let mockProviders = JSON.parse(localStorage.getItem('mockProviders')) || [];

// Initialize the page
function init() {
    // Set up event listeners
    signupForm.addEventListener('submit', handleSignup);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
}

// Handle form submission
function handleSignup(e) {
    e.preventDefault();
    
    // Reset messages
    hideMessages();
    
    // Get form data
    const formData = new FormData(signupForm);
    const provider = {
        id: Date.now(), // Generate a unique ID (would be handled by the server in a real app)
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email').toLowerCase(),
        agencyName: formData.get('agencyName'),
        jobTitle: formData.get('jobTitle') || null,
        workPhone: formData.get('workPhone') || null,
        password: formData.get('password'), // In a real app, this would be hashed
        isVerifiedByAdmin: true, // Auto-approve for demo purposes
        emailVerifiedAt: new Date().toISOString(), // Auto-verify for demo purposes
        createdAt: new Date().toISOString(),
        facilities: [] // No facilities assigned yet
    };
    
    // Validate form data
    if (!validateForm(provider)) {
        return;
    }
    
    // Check if email already exists
    if (mockProviders.some(p => p.email === provider.email)) {
        showError('An account with this email already exists. Please use a different email or sign in.');
        return;
    }
    
    // Save provider to mock database
    mockProviders.push(provider);
    localStorage.setItem('mockProviders', JSON.stringify(mockProviders));
    
    // Show success message
    showSuccess('Account created successfully! You will be redirected to sign in...');
    
    // Redirect to login page after a short delay
    setTimeout(() => {
        window.location.href = 'provider-signin.html';
    }, 2000);
}

// Validate form data
function validateForm(provider) {
    // Check required fields
    if (!provider.firstName || !provider.lastName || !provider.email || !provider.agencyName || !provider.password) {
        showError('Please fill in all required fields.');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(provider.email)) {
        showError('Please enter a valid email address.');
        return false;
    }
    
    // Validate password
    if (!validatePassword()) {
        return false;
    }
    
    // Validate password match
    if (!validatePasswordMatch()) {
        return false;
    }
    
    // All validations passed
    return true;
}

// Validate password complexity
function validatePassword() {
    const password = passwordInput.value;
    
    // Check password length and complexity
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (password && !(hasMinLength && hasUpperCase && hasLowerCase && hasNumber)) {
        passwordInput.setCustomValidity('Password must be at least 8 characters with uppercase, lowercase, and number');
        return false;
    }
    
    passwordInput.setCustomValidity('');
    return true;
}

// Validate password match
function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword && password !== confirmPassword) {
        confirmPasswordInput.setCustomValidity('Passwords do not match');
        return false;
    }
    
    confirmPasswordInput.setCustomValidity('');
    return true;
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