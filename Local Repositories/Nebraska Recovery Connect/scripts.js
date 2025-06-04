// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const ageGroupSelect = document.getElementById('age-group');
const genderServedSelect = document.getElementById('gender-served');
const treatmentTypeSelect = document.getElementById('treatment-type');
const facilityTypeSelect = document.getElementById('facility-type');
const detoxServicesSelect = document.getElementById('detox-services');
const facilitiesList = document.getElementById('facilities-list');
const totalResultsText = document.getElementById('total-results-text');
const viewToggleBtns = document.querySelectorAll('.view-btn');

// Mock data for facilities
const mockFacilities = [
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
        status_last_updated: "2025-05-25T10:00:00",
        detox_services: {
            available: true,
            detox_type: "Inpatient",
            substance_specialization: "Multiple",
            insurance_accepted: ["Medicaid", "Medicare", "Private"],
            detox_description: "24/7 medically supervised detoxification services with experienced medical staff. Specializes in alcohol and drug detox with medication-assisted treatment options.",
            services: ["Medical detox", "Medication management", "24/7 nursing care", "Nutritional support"],
            beds_available: 8,
            average_stay: "3-5 days"
        }
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
        status_last_updated: "2025-05-25T10:00:00",
        detox_services: {
            available: true,
            detox_type: "Inpatient",
            substance_specialization: "Alcohol",
            insurance_accepted: ["Medicare", "Private", "Self-Pay"],
            detox_description: "Hospital-based detoxification program with full medical support. Specializes in alcohol withdrawal management with psychiatric evaluation available.",
            services: ["Medical detox", "Psychiatric evaluation", "Family counseling", "Discharge planning"],
            beds_available: 2,
            average_stay: "4-7 days"
        }
    },
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
        availability_status: "Openings Available",
        status_last_updated: "2025-05-25T10:00:00",
        detox_services: {
            available: true,
            detox_type: "Outpatient",
            substance_specialization: "Opioids",
            insurance_accepted: ["Medicaid", "Private"],
            detox_description: "Outpatient medication-assisted detox program specializing in opioid addiction. Provides suboxone and other FDA-approved medications for safe withdrawal.",
            services: ["Medication-assisted treatment", "Individual counseling", "Group therapy", "Family support"],
            beds_available: null,
            average_stay: "1-2 weeks"
        }
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
        id: 10,
        name: "Houses of Hope of Nebraska",
        address: "1124 North Cotner Boulevard, Lincoln, NE 68505",
        phone: "(402) 435-3165",
        website: "http://www.housesofhope.us",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Halfway House",
        description: "Transitional housing program providing a supportive environment for those in recovery from substance abuse and mental health disorders.",
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

// Additional facilities (Part 2)
const mockFacilitiesPart2 = [
    {
        id: 13,
        name: "Nebraska Urban Indian Health Coalition",
        address: "2240 Landon Court, Omaha, NE 68102",
        phone: "(402) 346-0902",
        website: "http://www.nuihc.com",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Culturally-sensitive treatment services for Native Americans and other populations in need of substance abuse and mental health support.",
        availability_status: "Openings Available",
        status_last_updated: "2025-05-28T14:30:00"
    },
    {
        id: 14,
        name: "Northpoint Nebraska",
        address: "4601 North 84th Street, Omaha, NE 68134",
        phone: "(402) 389-0940",
        website: "https://www.northpointnebraska.com",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive substance abuse treatment center offering detox, residential, and outpatient services with a focus on individualized care.",
        availability_status: "No Openings",
        status_last_updated: "2025-05-29T09:15:00",
        detox_services: {
            available: true,
            detox_type: "Inpatient",
            substance_specialization: "Multiple",
            insurance_accepted: ["Private", "Self-Pay"],
            detox_description: "Medical detox program with 24/7 monitoring and support for safe withdrawal from alcohol, opioids, and other substances.",
            services: ["Medical detox", "Withdrawal management", "Transition to treatment", "Aftercare planning"],
            beds_available: 0,
            average_stay: "5-7 days"
        }
    },
    {
        id: 35,
        name: "Sunrise Place",
        address: "1220 South 13th Street, Norfolk, NE 68701",
        phone: "(402) 379-0040",
        website: "https://www.sunriseplace.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Residential treatment facility offering comprehensive substance abuse and mental health services in a supportive environment.",
        availability_status: "Openings Available",
        status_last_updated: "2025-05-30T11:20:00"
    },
    {
        id: 36,
        name: "Seekers of Serenity Place",
        address: "2912 20th Street, Columbus, NE 68601",
        phone: "(402) 564-9477",
        website: "https://www.seekersofserenity.org",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Short-term residential treatment facility providing evidence-based addiction treatment services in a structured environment.",
        availability_status: "Waitlist",
        status_last_updated: "2025-05-27T16:45:00"
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
        // Determine facility type for badge
        let facilityType = 'Treatment Center';
        if (facility.name.toLowerCase().includes('house') || facility.description.toLowerCase().includes('halfway house')) {
            facilityType = 'Halfway House';
        } else if (facility.name.toLowerCase().includes('outpatient') || facility.description.toLowerCase().includes('outpatient')) {
            facilityType = 'Outpatient';
        }
        
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
                ${facility.treatment_type} Treatment <span class="facility-type-badge">${facilityType}</span>
                ${facility.detox_services && facility.detox_services.available ? '<span class="facility-type-badge detox-badge">Detox Available</span>' : ''}
            </div>
            <div class="facility-status ${statusClass}">
                ${facility.availability_status}
            </div>
            <div class="facility-info">
                <p><i class="fas fa-map-marker-alt"></i> ${facility.address}</p>
                <p><i class="fas fa-user"></i> Serves: ${facility.gender_served}, ${facility.age_group}</p>
                <p><i class="fas fa-info-circle"></i> ${facility.description}</p>
                
                ${facility.detox_services && facility.detox_services.available ? `
                <div class="detox-info-section">
                    <h4><i class="fas fa-medkit"></i> Detox Services</h4>
                    <p>${facility.detox_services.detox_description}</p>
                    <div class="detox-details">
                        <div class="detox-detail">
                            <span class="detail-label">Type:</span> 
                            <span class="detail-value">${facility.detox_services.detox_type}</span>
                        </div>
                        <div class="detox-detail">
                            <span class="detail-label">Specializes in:</span> 
                            <span class="detail-value">${facility.detox_services.substance_specialization} Substances</span>
                        </div>
                        <div class="detox-detail">
                            <span class="detail-label">Average stay:</span> 
                            <span class="detail-value">${facility.detox_services.average_stay}</span>
                        </div>
                        <div class="detox-detail">
                            <span class="detail-label">Insurance:</span> 
                            <span class="detail-value">${facility.detox_services.insurance_accepted.join(', ')}</span>
                        </div>
                    </div>
                    
                    <div class="detox-services">
                        <h5>Detox Services Offered:</h5>
                        <ul>
                            ${facility.detox_services.services.map(service => `<li><i class="fas fa-check"></i> ${service}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                ` : ''}
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

// Filter by facility type (for quick help cards)
window.filterByType = function(type) {
    // Reset all filters first
    searchInput.value = '';
    ageGroupSelect.value = '';
    genderServedSelect.value = '';
    treatmentTypeSelect.value = '';
    facilityTypeSelect.value = '';
    
    // Apply specific filter based on type
    switch(type) {
        case 'emergency':
            searchInput.value = 'crisis';
            break;
        case 'Treatment Center':
        case 'Halfway House':
        case 'Outpatient':
            facilityTypeSelect.value = type;
            break;
    }
    
    // Scroll to results section
    document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' });
    
    // Perform search with the new filter
    setTimeout(performSearch, 500);
};

// Search functionality
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Get filter values
    const ageGroup = ageGroupSelect.value;
    const genderServed = genderServedSelect.value;
    const treatmentType = treatmentTypeSelect.value;
    const facilityType = facilityTypeSelect.value;
    
    // Filter facilities based on search term and filters
    const filteredFacilities = mockFacilities.filter(facility => {
        // Search term matching
        const matchesSearch = searchTerm === '' || 
            facility.name.toLowerCase().includes(searchTerm) || 
            facility.address.toLowerCase().includes(searchTerm) ||
            facility.description.toLowerCase().includes(searchTerm);
        
        // Filter matching
        const matchesAge = ageGroup === '' || facility.age_group === ageGroup;
        const matchesGender = genderServed === '' || facility.gender_served === genderServed;
        const matchesTreatment = treatmentType === '' || facility.treatment_type === treatmentType;
        
        // Use explicit facility type from data
        const facilityTypeValue = facility.facility_type || 'Treatment Center';
        const matchesFacilityType = facilityType === '' || facilityTypeValue === facilityType;
        
        // Detox services filter
        const detoxServices = detoxServicesSelect.value;
        const hasDetoxServices = facility.detox_services && facility.detox_services.available;
        const matchesDetox = detoxServices === '' || 
            (detoxServices === 'true' && hasDetoxServices) ||
            (detoxServices === 'false' && !hasDetoxServices);
        
        return matchesSearch && matchesAge && matchesGender && matchesTreatment && matchesFacilityType && matchesDetox;
    });
    
    // Update display and count
    displayFacilities(filteredFacilities);
    totalResultsText.textContent = filteredFacilities.length;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Display all facilities on page load
    displayFacilities(mockFacilities);
    
    // Update total count
    totalResultsText.textContent = mockFacilities.length;
    
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
});