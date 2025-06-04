// DOM Elements for search functionality
let halfwayHouses = [];

// Function to load facilities data
function loadFacilitiesData() {
    // Check if nebraskaHalfwayHouses is already defined (halfway-houses-data.js already loaded)
    if (typeof nebraskaHalfwayHouses !== 'undefined') {
        halfwayHouses = nebraskaHalfwayHouses;
        updateHalfwayHousesUI();
    } else {
        // Load halfway-houses-data.js if not already loaded
        const scriptTag = document.createElement('script');
        scriptTag.src = 'halfway-houses-data.js';
        scriptTag.onload = function() {
            // Once halfway-houses-data.js is loaded, the nebraskaHalfwayHouses variable should be available
            if (typeof nebraskaHalfwayHouses !== 'undefined') {
                halfwayHouses = nebraskaHalfwayHouses;
                updateHalfwayHousesUI();
            } else {
                console.error('Nebraska halfway houses data not found');
                // Use the hardcoded data as fallback
                useFallbackData();
            }
        };
        document.head.appendChild(scriptTag);
    }
}

// Update the UI with halfway houses data
function updateHalfwayHousesUI() {
    // Find and update the table if it exists
    const halfwayTable = document.querySelector('.halfway-table tbody');
    if (halfwayTable) {
        // Clear existing rows
        halfwayTable.innerHTML = '';
        
        // Add each halfway house to the table
        halfwayHouses.forEach(house => {
            const row = document.createElement('tr');
            const formattedPhone = house.phone.replace(/[^\d]/g, '');
            
            row.innerHTML = `
                <td>${house.name}</td>
                <td>${house.address.split(',')[1].trim()}</td>
                <td>${house.gender_served}</td>
                <td><a href="tel:${formattedPhone}">${house.phone}</a></td>
            `;
            
            halfwayTable.appendChild(row);
        });
    }
    
    // Update any other UI elements that display halfway houses
    const halfwayCount = document.getElementById('halfway-count');
    if (halfwayCount) {
        halfwayCount.textContent = halfwayHouses.length;
    }
}

// Use fallback data if scripts.js can't be loaded
function useFallbackData() {
    // Fallback data for halfway houses
    halfwayHouses = [
        {
            id: 10,
            name: "Houses of Hope of Nebraska",
            address: "1124 North Cotner Boulevard, Lincoln, NE 68505",
            phone: "(402) 435-3165",
            website: "http://www.housesofhope.us",
            treatment_type: "Both",
            age_group: "Adult",
            gender_served: "Male",
            facility_type: "Halfway House",
            description: "Transitional housing program providing a supportive environment for those in recovery from substance abuse and mental health disorders.",
            availability_status: "Status Not Updated",
            status_last_updated: "2025-05-25T10:00:00"
        },
        {
            id: 15,
            name: "Nebraska/Western Iowa HCR",
            address: "345 W 14th St, Grand Island, NE 68801",
            phone: "(308) 382-3660",
            website: "http://www.hcr.org",
            treatment_type: "Substance Abuse",
            age_group: "Adult",
            gender_served: "Co-ed",
            facility_type: "Halfway House",
            description: "Transitional living facility for individuals in recovery from substance use disorders, providing a structured environment and support services.",
            availability_status: "Available",
            status_last_updated: "2025-05-20T10:00:00"
        },
        {
            id: 16,
            name: "Friendship House Inc",
            address: "720 W 2nd St, Grand Island, NE 68801",
            phone: "(308) 385-3900",
            website: "http://www.friendshiphouse.org",
            treatment_type: "Substance Abuse",
            age_group: "Adult",
            gender_served: "Co-ed",
            facility_type: "Halfway House",
            description: "Supportive living environment for individuals in recovery, offering peer support and structured programming.",
            availability_status: "Available",
            status_last_updated: "2025-05-22T10:00:00"
        },
        {
            id: 17,
            name: "Revive Inc",
            address: "1402 W 2nd St, Hastings, NE 68901",
            phone: "(402) 462-2025",
            website: "http://www.reviveinc.org",
            treatment_type: "Substance Abuse",
            age_group: "Adult",
            gender_served: "Co-ed",
            facility_type: "Halfway House",
            description: "Recovery-focused transitional housing program with emphasis on life skills development and community reintegration.",
            availability_status: "Waitlist",
            status_last_updated: "2025-05-15T10:00:00"
        },
        {
            id: 18,
            name: "The Link Inc",
            address: "1001 W Norfolk Ave, Norfolk, NE 68701",
            phone: "(402) 371-5310",
            website: "http://www.thelinkne.org",
            treatment_type: "Both",
            age_group: "Adult",
            gender_served: "Co-ed",
            facility_type: "Halfway House",
            description: "Transitional living facility that bridges the gap between treatment and independent living, providing structure and support.",
            availability_status: "Available",
            status_last_updated: "2025-05-18T10:00:00"
        },
        {
            id: 19,
            name: "Human Services Inc",
            address: "1115 Yellowstone Ave, Alliance, NE 69301",
            phone: "(308) 762-7177",
            website: "http://www.humanservices.org",
            treatment_type: "Both",
            age_group: "Adult",
            gender_served: "Co-ed",
            facility_type: "Halfway House",
            description: "Supportive living environment with focus on rural recovery support and community integration.",
            availability_status: "Available",
            status_last_updated: "2025-05-23T10:00:00"
        },
        {
            id: 20,
            name: "Saint Monica's Transitional Housing",
            address: "120 Military Road, Lincoln, NE 68508",
            phone: "(402) 441-3768",
            website: "http://www.stmonicas.com",
            treatment_type: "Both",
            age_group: "Adult",
            gender_served: "Female",
            facility_type: "Halfway House",
            description: "Gender-specific transitional housing for women in recovery, with specialized support for mothers and women with trauma histories.",
            availability_status: "Available",
            status_last_updated: "2025-05-24T10:00:00"
        },
        {
            id: 21,
            name: "ARCH Inc",
            address: "604 S 37th St, Omaha, NE 68105",
            phone: "(402) 505-9904",
            website: "http://www.archomaha.org",
            treatment_type: "Substance Abuse",
            age_group: "Adult",
            gender_served: "Male",
            facility_type: "Halfway House",
            description: "Men's recovery residence providing structured living and recovery support services in the Omaha metropolitan area.",
            availability_status: "Waitlist",
            status_last_updated: "2025-05-21T10:00:00"
        }
    ];

    // Update UI with fallback data
    updateHalfwayHousesUI();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load facilities data
    loadFacilitiesData();
});