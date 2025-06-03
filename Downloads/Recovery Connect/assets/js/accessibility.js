/**
 * Accessibility Features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create accessibility menu
    const accessibilityMenu = document.createElement('div');
    accessibilityMenu.className = 'accessibility-menu';
    accessibilityMenu.innerHTML = `
        <div class="accessibility-toggle">
            <i class="fas fa-universal-access"></i>
        </div>
        <div class="accessibility-panel">
            <h3>Accessibility</h3>
            <div class="accessibility-option">
                <label>
                    <input type="checkbox" id="high-contrast"> High Contrast
                </label>
            </div>
            <div class="accessibility-option">
                <label>
                    <input type="checkbox" id="large-text"> Larger Text
                </label>
            </div>
            <div class="accessibility-option">
                <label>
                    <input type="checkbox" id="dyslexia-friendly"> Dyslexia Friendly
                </label>
            </div>
        </div>
    `;
    
    document.body.appendChild(accessibilityMenu);
    
    // Toggle accessibility panel
    const accessibilityToggle = accessibilityMenu.querySelector('.accessibility-toggle');
    const accessibilityPanel = accessibilityMenu.querySelector('.accessibility-panel');
    
    accessibilityToggle.addEventListener('click', function() {
        accessibilityPanel.classList.toggle('active');
    });
    
    // High Contrast Mode
    const highContrastToggle = document.getElementById('high-contrast');
    highContrastToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('high-contrast');
            localStorage.setItem('highContrast', 'true');
        } else {
            document.body.classList.remove('high-contrast');
            localStorage.setItem('highContrast', 'false');
        }
    });
    
    // Large Text Mode
    const largeTextToggle = document.getElementById('large-text');
    largeTextToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('large-text');
            localStorage.setItem('largeText', 'true');
        } else {
            document.body.classList.remove('large-text');
            localStorage.setItem('largeText', 'false');
        }
    });
    
    // Dyslexia Friendly Mode
    const dyslexiaToggle = document.getElementById('dyslexia-friendly');
    dyslexiaToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dyslexia-friendly');
            localStorage.setItem('dyslexiaFriendly', 'true');
        } else {
            document.body.classList.remove('dyslexia-friendly');
            localStorage.setItem('dyslexiaFriendly', 'false');
        }
    });
    
    // Load saved preferences
    if (localStorage.getItem('highContrast') === 'true') {
        highContrastToggle.checked = true;
        document.body.classList.add('high-contrast');
    }
    
    if (localStorage.getItem('largeText') === 'true') {
        largeTextToggle.checked = true;
        document.body.classList.add('large-text');
    }
    
    if (localStorage.getItem('dyslexiaFriendly') === 'true') {
        dyslexiaToggle.checked = true;
        document.body.classList.add('dyslexia-friendly');
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', function(event) {
        if (!accessibilityMenu.contains(event.target)) {
            accessibilityPanel.classList.remove('active');
        }
    });
});