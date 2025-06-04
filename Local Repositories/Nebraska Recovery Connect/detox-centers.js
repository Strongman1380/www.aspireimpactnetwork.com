// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const detoxTypeSelect = document.getElementById('detox-type');
const substanceTypeSelect = document.getElementById('substance-type');
const countySelect = document.getElementById('county');
const insuranceSelect = document.getElementById('insurance');
const detoxList = document.getElementById('detox-list');
const totalResultsText = document.getElementById('total-results-text');

// Load Nebraska detox centers data
let detoxCenters = [];

// Function to load facilities data
function loadFacilitiesData() {
    // Check if nebraskaDetoxCenters is already defined (detox-centers-data.js already loaded)
    if (typeof nebraskaDetoxCenters !== 'undefined') {
        detoxCenters = nebraskaDetoxCenters;
        displayDetoxCenters(detoxCenters);
        totalResultsText.textContent = detoxCenters.length;
    } else {
        // Load detox-centers-data.js if not already loaded
        const scriptTag = document.createElement('script');
        scriptTag.src = 'detox-centers-data.js';
        scriptTag.onload = function() {
            // Once detox-centers-data.js is loaded, the nebraskaDetoxCenters variable should be available
            if (typeof nebraskaDetoxCenters !== 'undefined') {
                detoxCenters = nebraskaDetoxCenters;
                displayDetoxCenters(detoxCenters);
                totalResultsText.textContent = detoxCenters.length;
            } else {
                console.error('Nebraska detox centers data not found');
                // Use the hardcoded data as fallback
                useFallbackData();
            }
        };
        document.head.appendChild(scriptTag);
    }
}

// Use fallback data if detox-centers-data.js can't be loaded
function useFallbackData() {
    // Fallback data for detox centers
    detoxCenters = [
    {
        id: 1,
        name: "Bridge Behavioral Health Detox Center",
        address: "721 K Street, Lincoln, NE 68508",
        phone: "(402) 441-8716",
        website: "https://www.thebridgelincoln.com",
        detox_type: "Inpatient",
        substance_specialization: "Multiple",
        insurance_accepted: ["Medicaid", "Medicare", "Private"],
        description: "24/7 medically supervised detoxification services with experienced medical staff. Specializes in alcohol and drug detox with medication-assisted treatment options.",
        services: ["Medical detox", "Medication management", "24/7 nursing care", "Nutritional support"],
        availability_status: "Available",
        beds_available: 8,
        average_stay: "3-5 days"
    },
    {
        id: 2,
        name: "CHI Health Behavioral Health Detox Unit",
        address: "7500 Mercy Road, Omaha, NE 68124",
        phone: "(402) 717-8700",
        website: "https://www.chihealth.com",
        detox_type: "Inpatient",
        substance_specialization: "Alcohol",
        insurance_accepted: ["Medicare", "Private", "Self-Pay"],
        description: "Hospital-based detoxification program with full medical support. Specializes in alcohol withdrawal management with psychiatric evaluation available.",
        services: ["Medical detox", "Psychiatric evaluation", "Family counseling", "Discharge planning"],
        availability_status: "Waitlist",
        beds_available: 2,
        average_stay: "4-7 days"
    },
    {
        id: 3,
        name: "Omaha Treatment Center Detox Program",
        address: "2422 Cuming Street, Omaha, NE 68131",
        phone: "(402) 344-0963",
        website: "https://www.omahatreatment.com",
        detox_type: "Outpatient",
        substance_specialization: "Opioids",
        insurance_accepted: ["Medicaid", "Private"],
        description: "Outpatient medication-assisted detox program specializing in opioid addiction. Provides suboxone and other FDA-approved medications for safe withdrawal.",
        services: ["Medication-assisted treatment", "Individual counseling", "Group therapy", "Family support"],
        availability_status: "Available",
        beds_available: null,
        average_stay: "1-2 weeks"
    }
];

// Function to display detox centers
function displayDetoxCenters(centers) {
    // Clear current list
    detoxList.innerHTML = '';
    
    // Check if there are centers to display
    if (centers.length === 0) {
        detoxList.innerHTML = '<div class="no-results">No detox centers match your search criteria. Please try different filters or call our helpline for assistance.</div>';
        return;
    }
    
    // Loop through centers and create cards
    centers.forEach(center => {
        const card = document.createElement('div');
        card.className = 'facility-card detox-card';
        
        // Availability status
        let statusClass = 'status-not-updated';
        let statusText = center.availability_status;
        
        if (center.availability_status === 'Available') {
            statusClass = 'status-available';
        } else if (center.availability_status === 'Unavailable') {
            statusClass = 'status-unavailable';
        } else if (center.availability_status === 'Waitlist') {
            statusClass = 'status-waitlist';
        }
        
        // Format phone number for href
        const formattedPhone = center.phone.replace(/[^\d]/g, '');
        
        // Create services list
        const servicesList = Array.isArray(center.services) 
            ? center.services.map(service => `<li><i class="fas fa-check"></i> ${service}</li>`).join('')
            : `<li><i class="fas fa-check"></i> ${center.services}</li>`;
        
        // Create insurance list
        const insuranceList = Array.isArray(center.insurance_accepted) 
            ? center.insurance_accepted.join(', ')
            : center.insurance_accepted;
        
        // Additional phone info
        const additionalPhone = center.intake_phone 
            ? `<p><i class="fas fa-phone"></i> Intake: <a href="tel:${center.intake_phone.replace(/[^\d]/g, '')}">${center.intake_phone}</a></p>` 
            : center.secondary_phone 
            ? `<p><i class="fas fa-phone"></i> Alt: <a href="tel:${center.secondary_phone.replace(/[^\d]/g, '')}">${center.secondary_phone}</a></p>`
            : '';
        
        // County info
        const countyInfo = center.county ? `<p><i class="fas fa-map"></i> County: ${center.county}</p>` : '';
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="facility-name">${center.name}</h3>
                <div class="facility-category">
                    ${center.detox_type} Detox <span class="facility-type-badge">${center.substance_specialization} Substances</span>
                </div>
                <div class="facility-status ${statusClass}">
                    ${statusText}${center.beds_available ? ` (${center.beds_available} beds available)` : ''}
                </div>
            </div>
            
            <div class="facility-info">
                <p><i class="fas fa-map-marker-alt"></i> ${center.address}</p>
                ${countyInfo}
                <p><i class="fas fa-clock"></i> Average stay: ${center.average_stay}</p>
                <p><i class="fas fa-credit-card"></i> Insurance: ${insuranceList}</p>
                ${additionalPhone}
                <p><i class="fas fa-info-circle"></i> ${center.description}</p>
                
                <div class="services-section">
                    <h4>Services Offered:</h4>
                    <ul class="services-list">
                        ${servicesList}
                    </ul>
                </div>
            </div>
            
            <div class="facility-actions">
                <a href="https://maps.google.com/?q=${encodeURIComponent(center.address)}" target="_blank" class="action-btn btn-directions">
                    <i class="fas fa-directions"></i> Directions
                </a>
                <a href="tel:${formattedPhone}" class="action-btn btn-call">
                    <i class="fas fa-phone-alt"></i> Call Now
                </a>
                ${center.website ? `
                <a href="${center.website}" target="_blank" class="action-btn btn-website">
                    <i class="fas fa-globe"></i> Website
                </a>
                ` : ''}
            </div>
        `;
        
        // Add card to list
        detoxList.appendChild(card);
    });
}

// Search functionality
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Get filter values
    const detoxType = detoxTypeSelect.value;
    const substanceType = substanceTypeSelect.value;
    const county = countySelect.value;
    const insurance = insuranceSelect.value;
    
    // Filter centers based on search term and filters
    const filteredCenters = detoxCenters.filter(center => {
        // Search term matching
        const matchesSearch = searchTerm === '' || 
            center.name.toLowerCase().includes(searchTerm) || 
            center.address.toLowerCase().includes(searchTerm) ||
            center.description.toLowerCase().includes(searchTerm) ||
            (center.county && center.county.toLowerCase().includes(searchTerm));
        
        // Filter matching
        const matchesDetoxType = detoxType === '' || center.detox_type === detoxType;
        const matchesSubstanceType = substanceType === '' || center.substance_specialization === substanceType;
        const matchesCounty = county === '' || (center.county && center.county === county);
        
        // Check if any of the accepted insurance types match the selected insurance
        const matchesInsurance = insurance === '' || 
            (center.insurance_accepted && 
             Array.isArray(center.insurance_accepted) && 
             center.insurance_accepted.some(ins => ins.toLowerCase().includes(insurance.toLowerCase())));
        
        return matchesSearch && matchesDetoxType && matchesSubstanceType && matchesCounty && matchesInsurance;
    });
    
    // Update display and count
    displayDetoxCenters(filteredCenters);
    totalResultsText.textContent = filteredCenters.length;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load facilities data
    loadFacilitiesData();
    
    // Setup event listeners
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Filter change events
    const filterSelects = document.querySelectorAll('.filter-group select');
    filterSelects.forEach(select => {
        select.addEventListener('change', performSearch);
    });
    
    // Clear all filters to show all detox centers by default
    searchInput.value = '';
    detoxTypeSelect.value = '';
    substanceTypeSelect.value = '';
    countySelect.value = '';
    insuranceSelect.value = '';
});