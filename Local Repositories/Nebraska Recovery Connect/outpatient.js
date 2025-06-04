// DOM Elements
const searchInput = document.querySelector('.search-container input');
const searchBtn = document.querySelector('.search-container button');
const locationSelect = document.getElementById('location');
const specializationSelect = document.getElementById('specialization');
const insuranceSelect = document.getElementById('insurance');

// Load outpatient providers data
let outpatientServices = [];

// Function to load facilities data
function loadFacilitiesData() {
    // Check if nebraskaOutpatientProviders is already defined (outpatient-providers-data.js already loaded)
    if (typeof nebraskaOutpatientProviders !== 'undefined') {
        outpatientServices = nebraskaOutpatientProviders;
        displayOutpatientServices(outpatientServices);
    } else {
        // Load outpatient-providers-data.js if not already loaded
        const scriptTag = document.createElement('script');
        scriptTag.src = 'outpatient-providers-data.js';
        scriptTag.onload = function() {
            // Once outpatient-providers-data.js is loaded, the nebraskaOutpatientProviders variable should be available
            if (typeof nebraskaOutpatientProviders !== 'undefined') {
                outpatientServices = nebraskaOutpatientProviders;
                displayOutpatientServices(outpatientServices);
            } else {
                console.error('Nebraska outpatient providers data not found');
                // Use the hardcoded data as fallback
                useFallbackData();
            }
        };
        document.head.appendChild(scriptTag);
    }
}

// Use fallback data if scripts.js can't be loaded
function useFallbackData() {
    // Fallback data for outpatient services
    outpatientServices = [
    {
        id: 7,
        name: "Omaha Treatment Center",
        address: "2422 Cuming Street, Omaha, NE 68131",
        phone: "(402) 344-0963",
        website: "https://www.omahatreatment.com",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Outpatient",
        description: "Comprehensive outpatient addiction treatment center providing individual and group therapy, medication-assisted treatment, and family support services.",
        availability_status: "Available",
        services: "SOP, IOP, Medication-Assisted Treatment",
        specialties: "Substance Use Disorders, Opioid Addiction",
        insurance: "Medicaid, Private Insurance",
        location: "omaha"
    },
    {
        id: 13,
        name: "CenterPointe Outpatient Services",
        address: "1000 S 13th Street, Lincoln, NE 68508",
        phone: "(402) 475-8717",
        website: "http://www.centerpointe.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Outpatient",
        description: "Comprehensive outpatient behavioral health services providing individual therapy, group therapy, and intensive outpatient programs.",
        availability_status: "Available",
        services: "IOP, PHP, Medication Management, Individual Therapy",
        specialties: "Dual Diagnosis, Trauma-Informed Care",
        insurance: "Medicaid, Medicare, Private Insurance",
        location: "lincoln"
    },
    {
        id: 14,
        name: "Blue Valley Behavioral Health",
        address: "3901 Normal Blvd, Lincoln, NE 68506",
        phone: "(402) 477-6981",
        website: "http://www.bluevalleybehavioral.com",
        treatment_type: "Mental Health",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Outpatient",
        description: "Mental health outpatient clinic specializing in depression, anxiety, and trauma therapy services.",
        availability_status: "Available",
        services: "Individual Therapy, Group Therapy, Family Therapy",
        specialties: "Depression, Anxiety, PTSD",
        insurance: "Medicaid, Medicare, Private Insurance, Self-Pay",
        location: "lincoln"
    }
];

// Function to display outpatient services
function displayOutpatientServices(services) {
    const container = document.querySelector('.outpatient-content');
    
    // Remove existing cards except for static content
    const existingCards = container.querySelectorAll('.outpatient-card');
    existingCards.forEach(card => card.remove());
    
    if (services.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = '<p>No outpatient services match your search criteria. Please try different filters.</p>';
        container.appendChild(noResults);
        return;
    }
    
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'outpatient-card';
        
        const formattedPhone = service.phone.replace(/[^\d]/g, '');
        
        card.innerHTML = `
            <div class="outpatient-name">${service.name}</div>
            <div class="outpatient-info">
                <p><strong>Location:</strong> ${service.address}</p>
                <p><strong>Phone:</strong> ${service.phone}</p>
                <p><strong>Services:</strong> ${service.services}</p>
                <p><strong>Specialties:</strong> ${service.specialties}</p>
                <p><strong>Insurance:</strong> ${service.insurance}</p>
                <p><strong>Description:</strong> ${service.description}</p>
            </div>
            <div class="outpatient-actions">
                <a href="tel:${formattedPhone}" class="outpatient-btn btn-contact">Call</a>
                <a href="https://maps.google.com/?q=${encodeURIComponent(service.address)}" target="_blank" class="outpatient-btn btn-directions">Directions</a>
                ${service.website ? `<a href="${service.website}" target="_blank" class="outpatient-btn btn-website">Website</a>` : ''}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Search functionality
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const location = locationSelect.value;
    const specialization = specializationSelect.value;
    const insurance = insuranceSelect.value;
    
    const filteredServices = outpatientServices.filter(service => {
        const matchesSearch = searchTerm === '' || 
            service.name.toLowerCase().includes(searchTerm) || 
            service.address.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm);
        
        const matchesLocation = location === '' || service.location === location;
        
        const matchesSpecialization = specialization === '' || 
            service.treatment_type.toLowerCase().includes(specialization.replace('-', ' ')) ||
            service.specialties.toLowerCase().includes(specialization.replace('-', ' '));
        
        const matchesInsurance = insurance === '' || 
            service.insurance.toLowerCase().includes(insurance);
        
        return matchesSearch && matchesLocation && matchesSpecialization && matchesInsurance;
    });
    
    displayOutpatientServices(filteredServices);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load facilities data
    loadFacilitiesData();
    
    // Setup event listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Filter change events
    [locationSelect, specializationSelect, insuranceSelect].forEach(select => {
        if (select) {
            select.addEventListener('change', performSearch);
        }
    });
    
    // Clear all filters to show all outpatient providers by default
    if (searchInput) searchInput.value = '';
    if (locationSelect) locationSelect.value = '';
    if (specializationSelect) specializationSelect.value = '';
    if (insuranceSelect) insuranceSelect.value = '';
});