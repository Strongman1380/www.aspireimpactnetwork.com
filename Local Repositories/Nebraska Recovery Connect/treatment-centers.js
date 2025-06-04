// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const ageGroupSelect = document.getElementById('age-group');
const genderServedSelect = document.getElementById('gender-served');
const treatmentTypeSelect = document.getElementById('treatment-type');
const countySelect = document.getElementById('county');
const facilitiesList = document.getElementById('facilities-list');
const totalResultsText = document.getElementById('total-results-text');
const viewToggleBtns = document.querySelectorAll('.view-btn');

// Load all facilities data from treatment-centers-data.js
let treatmentCenters = [];

// Function to load facilities data
function loadFacilitiesData() {
    // Check if nebraskaTreatmentCenters is already defined (treatment-centers-data.js already loaded)
    if (typeof nebraskaTreatmentCenters !== 'undefined') {
        treatmentCenters = nebraskaTreatmentCenters;
        displayFacilities(treatmentCenters);
        totalResultsText.textContent = treatmentCenters.length;
    } else {
        // Load treatment-centers-data.js if not already loaded
        const scriptTag = document.createElement('script');
        scriptTag.src = 'treatment-centers-data.js';
        scriptTag.onload = function() {
            // Once treatment-centers-data.js is loaded, the nebraskaTreatmentCenters variable should be available
            if (typeof nebraskaTreatmentCenters !== 'undefined') {
                treatmentCenters = nebraskaTreatmentCenters;
                displayFacilities(treatmentCenters);
                totalResultsText.textContent = treatmentCenters.length;
            } else {
                console.error('Nebraska treatment centers data not found');
                // Use the hardcoded data as fallback
                useFallbackData();
            }
        };
        document.head.appendChild(scriptTag);
    }
}

// Use fallback data if scripts.js can't be loaded
function useFallbackData() {
    // Fallback data for treatment centers
    treatmentCenters = [
    {
        id: 1,
        name: "Horizon Recovery Counseling Center",
        address: "2900 Blondo Street, Omaha, NE 68111",
        phone: "(402) 991-0110",
        website: "http://www.horizon.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "40-bed residential facility serving adult men and women in East Omaha, offering comprehensive substance abuse and mental health treatment.",
        availability_status: "Status Not Updated",
        status_last_updated: "2025-05-25T10:00:00"
    },
    {
        id: 2,
        name: "Mid Plains Center for Behavioral Healthcare Services",
        address: "914 Baumann Drive, Grand Island, NE 68803",
        phone: "(308) 385-5250",
        website: "http://www.midplainscentral.org",
        treatment_type: "Mental Health",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "30-bed residential facility providing mental health services for adults in Hall County.",
        availability_status: "Status Not Updated",
        status_last_updated: "2025-05-25T10:00:00"
    },
    {
        id: 3,
        name: "CenterPointe Adult Long Term Residential Program",
        address: "2200 South 10th Street, Lincoln, NE 68502",
        phone: "(402) 475-8717",
        website: "http://www.centerpointe.org",
        treatment_type: "Mental Health",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "40-bed adult residential treatment program in Lancaster County providing mental health services.",
        availability_status: "Status Not Updated",
        status_last_updated: "2025-05-25T10:00:00"
    },
    {
        id: 4,
        name: "CenterPointe Campus for Health and Wellbeing",
        address: "2202 South 11th Street, Lincoln, NE 68502",
        phone: "(402) 475-8717",
        website: "http://www.centerpointe.org",
        treatment_type: "Mental Health",
        age_group: "Juvenile",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "40-bed residential treatment facility for youth and families in Lancaster County.",
        availability_status: "Status Not Updated",
        status_last_updated: "2025-05-25T10:00:00"
    },
    {
        id: 5,
        name: "Bridge Behavioral Health",
        address: "721 K Street, Lincoln, NE 68508",
        phone: "(402) 477-3951",
        website: "http://",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "30-bed residential facility in Lancaster County providing substance abuse treatment services. Offers detox and extended residential treatment program for adults.",
        availability_status: "Status Not Updated",
        status_last_updated: "2025-05-25T10:00:00"
    },
    {
        id: 6,
        name: "CHI Health Behavioral Health",
        address: "7500 Mercy Road, Omaha, NE 68124",
        phone: "(402) 717-8700",
        website: "https://www.chihealth.com",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Hospital-based behavioral health services providing comprehensive addiction and mental health treatment with full medical support.",
        availability_status: "Waitlist",
        status_last_updated: "2025-05-25T10:00:00"
    },
    {
        id: 8,
        name: "Saint Monica's Women and Children",
        address: "120 Military Road, Lincoln, NE 68508",
        phone: "(402) 441-3768",
        website: "http://www.stmonicas.com",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Treatment Center",
        description: "Treatment center focused on serving women and providing a supportive environment for mothers with children.",
        availability_status: "Status Not Updated",
        status_last_updated: "2025-05-25T10:00:00"
    },
    {
        id: 9,
        name: "Saint Monica's Behavioral Health Serve",
        address: "120 Military Road, Lincoln, NE 68508",
        phone: "(402) 441-3768",
        website: "http://www.stmonicas.com",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Treatment Center",
        description: "Comprehensive behavioral health services for women, focusing on trauma-informed care and addiction recovery.",
        availability_status: "Status Not Updated",
        status_last_updated: "2025-05-25T10:00:00"
    },
    {
        id: 11,
        name: "Whitehall Program",
        address: "6900 Walker Avenue, Lincoln, NE 68504",
        phone: "(402) 471-0856",
        website: "http://",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive treatment program with a focus on dual diagnosis and integrated treatment approaches.",
        availability_status: "Status Not Updated",
        status_last_updated: "2025-05-25T10:00:00"
    },
    {
        id: 12,
        name: "Saint Monica's Affirming Women's Development",
        address: "105 Wedgewood Drive, Lincoln, NE 68513",
        phone: "(402) 441-3768",
        website: "http://www.stmonicas.com",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Treatment Center",
        description: "Gender-specific program focusing on women's development and recovery through an affirming, supportive approach.",
        availability_status: "Status Not Updated",
        status_last_updated: "2025-05-25T10:00:00"
    }
];

// Function to display facilities
function displayFacilities(facilities) {
    // Clear current list
    facilitiesList.innerHTML = '';
    
    // Check if there are facilities to display
    if (facilities.length === 0) {
        facilitiesList.innerHTML = '<div class="no-results">No facilities match your search criteria. Please try different filters.</div>';
        return;
    }
    
    // Loop through facilities and create cards
    facilities.forEach(facility => {
        // Create facility card
        const card = document.createElement('div');
        card.className = 'facility-card';
        
        // Availability status
        let statusClass = 'status-not-updated';
        switch(facility.availability_status) {
            case 'Openings Available':
                statusClass = 'status-available';
                break;
            case 'No Openings':
                statusClass = 'status-unavailable';
                break;
            case 'Waitlist':
            case 'Accepting Assessments':
                statusClass = 'status-waitlist';
                break;
        }
        
        // Format phone number for href
        const formattedPhone = facility.phone.replace(/[^\d]/g, '');
        
        card.innerHTML = `
            <h3 class="facility-name">${facility.name}</h3>
            <div class="facility-category">
                ${facility.treatment_type} Treatment <span class="facility-type-badge">${facility.facility_type}</span>
            </div>
            <div class="facility-status ${statusClass}">
                ${facility.availability_status}
            </div>
            <div class="facility-info">
                <p><i class="fas fa-map-marker-alt"></i> ${facility.address}</p>
                ${facility.county ? `<p><i class="fas fa-map"></i> County: ${facility.county}</p>` : ''}
                <p><i class="fas fa-user"></i> Serves: ${facility.gender_served}, ${facility.age_group}</p>
                ${facility.intake_phone ? `<p><i class="fas fa-phone"></i> Intake: <a href="tel:${facility.intake_phone.replace(/[^\d]/g, '')}">${facility.intake_phone}</a></p>` : ''}
                ${facility.secondary_phone && !facility.intake_phone ? `<p><i class="fas fa-phone"></i> Alt: <a href="tel:${facility.secondary_phone.replace(/[^\d]/g, '')}">${facility.secondary_phone}</a></p>` : ''}
                <p><i class="fas fa-info-circle"></i> ${facility.description}</p>
            </div>
            <div class="facility-actions">
                <a href="https://maps.google.com/?q=${encodeURIComponent(facility.address)}" target="_blank" class="action-btn btn-directions">
                    <i class="fas fa-directions"></i> Directions
                </a>
                <a href="tel:${formattedPhone}" class="action-btn btn-call">
                    <i class="fas fa-phone-alt"></i> Call
                </a>
                ${facility.website ? `
                <a href="${facility.website}" target="_blank" class="action-btn btn-website">
                    <i class="fas fa-globe"></i> Website
                </a>
                ` : ''}
            </div>
        `;
        
        // Add card to list
        facilitiesList.appendChild(card);
    });
}

// View toggle functionality
function setupViewToggle() {
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const viewType = btn.getAttribute('data-view');
            if (viewType === 'cards') {
                facilitiesList.classList.add('cards-view');
                facilitiesList.classList.remove('list-view');
            } else {
                facilitiesList.classList.add('list-view');
                facilitiesList.classList.remove('cards-view');
            }
        });
    });
}

// Search functionality
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Get filter values
    const ageGroup = ageGroupSelect.value;
    const genderServed = genderServedSelect.value;
    const treatmentType = treatmentTypeSelect.value;
    const county = countySelect.value;
    
    // Filter facilities based on search term and filters
    const filteredFacilities = treatmentCenters.filter(facility => {
        // Search term matching
        const matchesSearch = searchTerm === '' || 
            facility.name.toLowerCase().includes(searchTerm) || 
            facility.address.toLowerCase().includes(searchTerm) ||
            facility.description.toLowerCase().includes(searchTerm) ||
            (facility.county && facility.county.toLowerCase().includes(searchTerm));
        
        // Filter matching
        const matchesAge = ageGroup === '' || facility.age_group === ageGroup;
        const matchesGender = genderServed === '' || facility.gender_served === genderServed;
        const matchesTreatment = treatmentType === '' || facility.treatment_type === treatmentType;
        const matchesCounty = county === '' || (facility.county && facility.county === county);
        
        return matchesSearch && matchesAge && matchesGender && matchesTreatment && matchesCounty;
    });
    
    // Update display and count
    displayFacilities(filteredFacilities);
    totalResultsText.textContent = filteredFacilities.length;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load facilities data
    loadFacilitiesData();
    
    // Setup view toggle
    setupViewToggle();
    
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
    
    // Clear all filters to show all treatment centers by default
    searchInput.value = '';
    ageGroupSelect.value = '';
    genderServedSelect.value = '';
    treatmentTypeSelect.value = '';
    countySelect.value = '';
});