// Nebraska Halfway Houses Data
const nebraskaHalfwayHouses = [
    {
        id: 201,
        name: "VA Nebraska/Western Iowa HCS - Grand Island CBOC",
        address: "2201 North Broadwell Avenue, Grand Island, NE 68803",
        phone: "(402) 995-4473",
        website: "http://www.nebraska.va.gov/locations/Grand_Island.asp",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Halfway House",
        description: "VA-operated transitional housing program for veterans in recovery from substance use disorders.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Hall",
        coordinates: {
            latitude: 40.9576,
            longitude: -98.494
        }
    },
    {
        id: 202,
        name: "Friendship House Inc",
        address: "406 West Koenig Street, Grand Island, NE 68801",
        phone: "(308) 382-0422",
        website: "http://www.thefriendshiphouse.net",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Halfway House",
        description: "Supportive living environment for individuals in recovery, offering peer support and structured programming.",
        availability_status: "Available",
        status_last_updated: "2025-05-22T10:00:00",
        county: "Hall",
        coordinates: {
            latitude: 40.9211065,
            longitude: -98.3412299
        },
        secondary_phone: "(308) 675-3345 ext. 18"
    },
    {
        id: 203,
        name: "Revive Inc - Horizon Recovery and Counseling Center",
        address: "2205 Osborne Drive East, Suite 115, Hastings, NE 68901",
        phone: "(402) 462-2066",
        website: "http://www.reviveinc.org",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Halfway House",
        description: "Recovery-focused transitional housing program with emphasis on life skills development and community reintegration.",
        availability_status: "Waitlist",
        status_last_updated: "2025-05-15T10:00:00",
        county: "Adams",
        coordinates: {
            latitude: 40.6089061,
            longitude: -98.3835624
        }
    },
    {
        id: 204,
        name: "Women's Empowering Life Line Inc - Intermediate Residential",
        address: "200 South 13th Street, Norfolk, NE 68701",
        phone: "(402) 371-0220",
        website: "http://www.womenslifeline.net",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Halfway House",
        description: "Gender-specific transitional housing for women in recovery, with specialized support for trauma survivors.",
        availability_status: "Available",
        status_last_updated: "2025-05-24T10:00:00",
        county: "Madison",
        coordinates: {
            latitude: 42.0312379,
            longitude: -97.4269069
        },
        secondary_phone: "(402) 860-8483"
    },
    {
        id: 205,
        name: "The Link Inc",
        address: "1001 West Norfolk Avenue, Norfolk, NE 68701",
        phone: "(402) 371-5310",
        website: "http://link-recovery.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Halfway House",
        description: "Transitional living facility that bridges the gap between treatment and independent living, providing structure and support.",
        availability_status: "Available",
        status_last_updated: "2025-05-18T10:00:00",
        county: "Madison",
        coordinates: {
            latitude: 42.0323678,
            longitude: -97.420666
        }
    },
    {
        id: 206,
        name: "Human Services Inc",
        address: "419 West 25th Street, Alliance, NE 69301",
        phone: "(308) 762-7177",
        website: "http://www.hsinc.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Halfway House",
        description: "Supportive living environment with focus on rural recovery support and community integration.",
        availability_status: "Available",
        status_last_updated: "2025-05-23T10:00:00",
        county: "Box Butte",
        coordinates: {
            latitude: 42.1193757999754,
            longitude: -102.875769693788
        }
    },
    {
        id: 207,
        name: "Houses of Hope of Nebraska Inc - Halfway House",
        address: "1124 North Cotner Boulevard, Lincoln, NE 68505",
        phone: "(402) 435-3165",
        website: "http://www.housesofhope.com",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Male",
        facility_type: "Halfway House",
        description: "Transitional housing program providing a supportive environment for men in recovery from substance abuse and mental health disorders.",
        availability_status: "Available",
        status_last_updated: "2025-05-25T10:00:00",
        county: "Lancaster",
        coordinates: {
            latitude: 40.8242072,
            longitude: -96.6328112
        },
        secondary_phone: "(402) 435-3165 ext. 112"
    },
    {
        id: 208,
        name: "Saint Monica's - Affirming Women's Empowerment",
        address: "105 Wedgewood Drive, Lincoln, NE 68510",
        phone: "(402) 441-3768",
        website: "http://www.stmonicas.com",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Halfway House",
        description: "Gender-specific transitional housing for women in recovery, with specialized support for mothers and women with trauma histories.",
        availability_status: "Available",
        status_last_updated: "2025-05-24T10:00:00",
        county: "Lancaster",
        coordinates: {
            latitude: 40.8125387,
            longitude: -96.6233429
        }
    },
    {
        id: 209,
        name: "ARCH Inc - O'Hanlon House",
        address: "1502 North 58th Street, Omaha, NE 68104",
        phone: "(402) 346-8898",
        website: "http://www.archhalfwayhouse.org",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Male",
        facility_type: "Halfway House",
        description: "Men's recovery residence providing structured living and recovery support services in the Omaha metropolitan area.",
        availability_status: "Waitlist",
        status_last_updated: "2025-05-21T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.2734141,
            longitude: -96.00274
        },
        secondary_phone: "(402) 556-6425"
    },
    {
        id: 210,
        name: "Heartland Family Service",
        address: "4847 Sahler Street, Omaha, NE 68104",
        phone: "(402) 342-9555",
        website: "http://www.heartlandfamilyservice.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Halfway House",
        description: "Transitional housing with comprehensive family support services for individuals in recovery.",
        availability_status: "Available",
        status_last_updated: "2025-05-19T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.2963002,
            longitude: -95.987687
        }
    },
    {
        id: 211,
        name: "Santa Monica Inc",
        address: "401 South 39th Street, Omaha, NE 68131",
        phone: "(402) 558-7088",
        website: "http://www.santamonicahouse.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Halfway House",
        description: "Women's transitional housing program with comprehensive recovery support and life skills development.",
        availability_status: "Available",
        status_last_updated: "2025-05-22T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.256997,
            longitude: -95.97148
        }
    },
    {
        id: 212,
        name: "ARCH Inc",
        address: "604 South 37th Street, Omaha, NE 68105",
        phone: "(402) 346-8898",
        website: "http://www.archhalfwayhouse.org",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Male",
        facility_type: "Halfway House",
        description: "Men's recovery residence providing structured living and recovery support services in the Omaha metropolitan area.",
        availability_status: "Waitlist",
        status_last_updated: "2025-05-21T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.2545589,
            longitude: -95.9680166
        },
        secondary_phone: "(402) 556-6425"
    },
    {
        id: 213,
        name: "Stephen Center Inc",
        address: "5217 South 28th Street, Omaha, NE 68107",
        phone: "(402) 715-5440",
        website: "http://www.stephencenter.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Halfway House",
        description: "Transitional housing program with comprehensive support services for homeless individuals in recovery.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.204818,
            longitude: -95.954323
        },
        intake_phone: "(402) 715-5451"
    },
    {
        id: 214,
        name: "Open Door Mission - Men's Ministries",
        address: "2705 North 20th Street East, Omaha, NE 68110",
        phone: "(402) 422-1111",
        website: "http://www.opendoormission.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Male",
        facility_type: "Halfway House",
        description: "Faith-based transitional housing program for men in recovery, with emphasis on spiritual growth and life skills development.",
        availability_status: "Available",
        status_last_updated: "2025-05-23T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.2836954,
            longitude: -95.9041594
        }
    }
];