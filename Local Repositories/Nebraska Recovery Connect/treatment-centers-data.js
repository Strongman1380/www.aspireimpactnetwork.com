// Nebraska Treatment Centers Data
const nebraskaTreatmentCenters = [
    {
        id: 301,
        name: "Psychiatric Hope",
        address: "321 East 3rd Street, North Platte, NE 69101",
        phone: "(308) 221-4651",
        website: "http://www.psychiatrichope.com",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive substance abuse treatment services in Lincoln County with a focus on individualized care.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Lincoln",
        coordinates: {
            latitude: 41.1353248,
            longitude: -100.759992
        }
    },
    {
        id: 302,
        name: "VA Nebraska/Western Iowa HCS - Grand Island CBOC",
        address: "2201 North Broadwell Avenue, Grand Island, NE 68803",
        phone: "(402) 995-4473",
        website: "http://www.nebraska.va.gov/locations/Grand_Island.asp",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "VA-operated treatment program for veterans with substance use disorders in Hall County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Hall",
        coordinates: {
            latitude: 40.9576,
            longitude: -98.494
        },
        secondary_phone: "(402) 995-4473 ext. 2134"
    },
    {
        id: 303,
        name: "CHI Health Saint Francis - Saint Francis Alcohol and Drug Treatment Center",
        address: "2112 West Faidley Avenue, Grand Island, NE 68803",
        phone: "(308) 398-5427",
        website: "http://www.chihealth.com/st-francis.html",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Hospital-based substance abuse treatment program with comprehensive medical support in Hall County.",
        availability_status: "Available",
        status_last_updated: "2025-05-22T10:00:00",
        county: "Hall",
        coordinates: {
            latitude: 40.9247086,
            longitude: -98.3638623
        }
    },
    {
        id: 304,
        name: "Friendship House Inc",
        address: "406 West Koenig Street, Grand Island, NE 68801",
        phone: "(308) 382-0422",
        website: "http://www.thefriendshiphouse.net",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive substance abuse treatment program with a focus on peer support and community integration.",
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
        id: 305,
        name: "Valley Hope of O'Neill",
        address: "1421 North 10th Street, O'Neill, NE 68763",
        phone: "(402) 336-0008",
        website: "http://www.valleyhope.org",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive substance abuse treatment services in Holt County with a focus on rural communities.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Holt",
        coordinates: {
            latitude: 42.4694532,
            longitude: -98.6393916
        },
        intake_phone: "(800) 544-5101"
    },
    {
        id: 306,
        name: "Revive Inc - Horizon Recovery and Counseling Center",
        address: "2205 Osborne Drive East, Suite 115, Hastings, NE 68901",
        phone: "(402) 462-2066",
        website: "http://www.reviveinc.org",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive substance abuse treatment services in Adams County with a focus on recovery and counseling.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Adams",
        coordinates: {
            latitude: 40.6089061,
            longitude: -98.3835624
        }
    },
    {
        id: 307,
        name: "Behavioral Health Specialists Inc - Seekers of Serenity Place",
        address: "4432 Sunrise Place, Columbus, NE 68601",
        phone: "(402) 564-9994",
        website: "http://www.4bhs.org",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive substance abuse treatment services in Platte County with a focus on behavioral health.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Platte",
        coordinates: {
            latitude: 41.4295473,
            longitude: -97.3814131
        }
    },
    {
        id: 308,
        name: "Behavioral Health Specialists Inc - Sunrise Place",
        address: "1900 Vicki Lane, Norfolk, NE 68701",
        phone: "(402) 379-0040",
        website: "http://www.4bhs.org",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive substance abuse treatment services in Madison County with a focus on behavioral health.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Madison",
        coordinates: {
            latitude: 42.0240841,
            longitude: -97.435609
        },
        intake_phone: "(402) 379-0040 ext. 3006"
    },
    {
        id: 309,
        name: "Women's Empowering Life Line Inc - Intermediate Residential",
        address: "200 South 13th Street, Norfolk, NE 68701",
        phone: "(402) 371-0220",
        website: "http://www.womenslifeline.net",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Treatment Center",
        description: "Gender-specific treatment program for women with substance use and mental health disorders in Madison County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Madison",
        coordinates: {
            latitude: 42.0312379,
            longitude: -97.4269069
        },
        secondary_phone: "(402) 860-8483"
    },
    {
        id: 310,
        name: "Women's Empowering Life Line Inc - Dual Disorder Program",
        address: "910 West Park Avenue, Norfolk, NE 68701",
        phone: "(402) 371-0220",
        website: "http://womenslifeline.net",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Treatment Center",
        description: "Specialized dual diagnosis treatment program for women in Madison County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Madison",
        coordinates: {
            latitude: 42.0293045,
            longitude: -97.4200215
        },
        secondary_phone: "(402) 379-3622"
    },
    {
        id: 311,
        name: "The Link Inc",
        address: "1001 West Norfolk Avenue, Norfolk, NE 68701",
        phone: "(402) 371-5310",
        website: "http://link-recovery.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive treatment program for substance use and mental health disorders in Madison County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Madison",
        coordinates: {
            latitude: 42.0323678,
            longitude: -97.420666
        }
    },
    {
        id: 312,
        name: "Women's Empowering Life Line Inc - Men's Dual Disorder",
        address: "306 West Indiana Avenue, Norfolk, NE 68701",
        phone: "(402) 371-0220",
        website: "http://www.thewellne.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Male",
        facility_type: "Treatment Center",
        description: "Specialized dual diagnosis treatment program for men in Madison County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Madison",
        coordinates: {
            latitude: 42.0196717,
            longitude: -97.4105286
        },
        secondary_phone: "(402) 370-2508"
    },
    {
        id: 313,
        name: "Human Services Inc",
        address: "419 West 25th Street, Alliance, NE 69301",
        phone: "(308) 762-7177",
        website: "http://www.hsinc.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive treatment program for substance use and mental health disorders in Box Butte County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Box Butte",
        coordinates: {
            latitude: 42.1193757999754,
            longitude: -102.875769693788
        }
    },
    {
        id: 314,
        name: "Saint Monica's Behavioral Health Services - Project Mother and Child",
        address: "1100 Military Road, Lincoln, NE 68508",
        phone: "(402) 441-3768",
        website: "http://www.stmonicas.com",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Treatment Center",
        description: "Specialized treatment program for mothers with children in Lancaster County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Lancaster",
        coordinates: {
            latitude: 40.8310343,
            longitude: -96.7050537
        },
        intake_phone: "(402) 441-3756"
    },
    {
        id: 315,
        name: "Saint Monica's Behavioral Health Services - Women Are Sacred",
        address: "1100 Military Road, Lincoln, NE 68508",
        phone: "(402) 441-3768",
        website: "http://www.stmonicas.com",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Treatment Center",
        description: "Specialized treatment program for women with trauma histories in Lancaster County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Lancaster",
        coordinates: {
            latitude: 40.8310343,
            longitude: -96.7050537
        },
        intake_phone: "(402) 441-3756"
    },
    {
        id: 316,
        name: "Bridge Behavioral Health",
        address: "721 K Street, Lincoln, NE 68508",
        phone: "(402) 477-3951",
        website: "http://www.thebridgenebraska.org",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive substance abuse treatment services in Lancaster County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Lancaster",
        coordinates: {
            latitude: 40.8088716,
            longitude: -96.7108461
        }
    },
    {
        id: 317,
        name: "CenterPointe - Adult Long Term Residential Program",
        address: "2220 South 10th Street, Lincoln, NE 68502",
        phone: "(402) 475-8748",
        website: "http://www.centerpointe.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Long-term residential treatment program for adults with co-occurring disorders in Lancaster County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Lancaster",
        coordinates: {
            latitude: 40.7905172,
            longitude: -96.7062497
        },
        secondary_phone: "(402) 475-8748 ext. 219"
    },
    {
        id: 318,
        name: "Bryan Medical Center West - Independence Center",
        address: "1640 Lake Street, Lincoln, NE 68502",
        phone: "(402) 481-5268",
        website: "http://www.bryanhealth.com/services/alcohol-drug-treatment",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Hospital-based treatment program for substance use and mental health disorders in Lancaster County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Lancaster",
        coordinates: {
            latitude: 40.7884103,
            longitude: -96.6980563
        }
    },
    {
        id: 319,
        name: "Houses of Hope Short Term Residential - Substance Use Treatment Program",
        address: "2633 P Street, Lincoln, NE 68503",
        phone: "(402) 474-4343",
        website: "http://www.touchstonelincoln.org",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Short-term residential treatment program for substance use disorders in Lancaster County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Lancaster",
        coordinates: {
            latitude: 40.8143174,
            longitude: -96.6828823
        },
        secondary_phone: "(402) 474-4343 ext. 117"
    },
    {
        id: 320,
        name: "Houses of Hope of Nebraska Inc - Halfway House",
        address: "1124 North Cotner Boulevard, Lincoln, NE 68505",
        phone: "(402) 435-3165",
        website: "http://www.housesofhope.com",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Male",
        facility_type: "Treatment Center",
        description: "Transitional housing program providing a supportive environment for men in recovery from substance abuse and mental health disorders.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Lancaster",
        coordinates: {
            latitude: 40.8242072,
            longitude: -96.6328112
        },
        secondary_phone: "(402) 435-3165 ext. 112"
    },
    {
        id: 321,
        name: "Saint Monica's - Affirming Women's Empowerment",
        address: "105 Wedgewood Drive, Lincoln, NE 68510",
        phone: "(402) 441-3768",
        website: "http://www.stmonicas.com",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Treatment Center",
        description: "Gender-specific treatment program for women in recovery in Lancaster County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Lancaster",
        coordinates: {
            latitude: 40.8125387,
            longitude: -96.6233429
        }
    },
    {
        id: 322,
        name: "Saint Monica's Behavioral Health Services - Short Term Residential",
        address: "120 Wedgewood Drive, Lincoln, NE 68510",
        phone: "(402) 441-3768",
        website: "http://www.stmonicas.com",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Treatment Center",
        description: "Short-term residential treatment program for women in Lancaster County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Lancaster",
        coordinates: {
            latitude: 40.8123341,
            longitude: -96.6225218
        },
        intake_phone: "(402) 441-3756"
    },
    {
        id: 323,
        name: "Saint Monica's Behavioral Health Services - Therapeutic Community",
        address: "120 Skyway Drive, Lincoln, NE 68510",
        phone: "(402) 441-3768",
        website: "http://www.stmonicas.com",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Treatment Center",
        description: "Therapeutic community for women in recovery in Lancaster County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Lancaster",
        coordinates: {
            latitude: 40.81398,
            longitude: -96.6157804
        },
        intake_phone: "(402) 441-3756"
    },
    {
        id: 324,
        name: "Inroads to Recovery Inc",
        address: "2808 North 75th Street, Omaha, NE 68134",
        phone: "(402) 932-2248",
        website: "http://inroadstorecovery.com",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive substance abuse treatment services in Douglas County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.2842075,
            longitude: -96.0283009
        }
    },
    {
        id: 325,
        name: "Community Alliance",
        address: "7150 Arbor Street, Omaha, NE 68106",
        phone: "(402) 341-5128",
        website: "https://community-alliance.org/",
        treatment_type: "Mental Health",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive mental health treatment services in Douglas County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.236914,
            longitude: -96.0230252
        }
    },
    {
        id: 326,
        name: "ARCH Inc - O'Hanlon House",
        address: "1502 North 58th Street, Omaha, NE 68104",
        phone: "(402) 346-8898",
        website: "http://www.archhalfwayhouse.org",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Male",
        facility_type: "Treatment Center",
        description: "Men's recovery residence providing structured living and recovery support services in Douglas County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.2734141,
            longitude: -96.00274
        },
        secondary_phone: "(402) 556-6425"
    },
    {
        id: 327,
        name: "Heartland Family Service",
        address: "4847 Sahler Street, Omaha, NE 68104",
        phone: "(402) 342-9555",
        website: "http://www.heartlandfamilyservice.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive treatment services for substance use and mental health disorders in Douglas County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.2963002,
            longitude: -95.987687
        }
    },
    {
        id: 328,
        name: "Santa Monica Inc",
        address: "401 South 39th Street, Omaha, NE 68131",
        phone: "(402) 558-7088",
        website: "http://www.santamonicahouse.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Treatment Center",
        description: "Women's treatment program for substance use and mental health disorders in Douglas County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.256997,
            longitude: -95.97148
        }
    },
    {
        id: 329,
        name: "ARCH Inc",
        address: "604 South 37th Street, Omaha, NE 68105",
        phone: "(402) 346-8898",
        website: "http://www.archhalfwayhouse.org",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Male",
        facility_type: "Treatment Center",
        description: "Men's recovery program providing structured treatment services in Douglas County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.2545589,
            longitude: -95.9680166
        },
        secondary_phone: "(402) 556-6425"
    },
    {
        id: 330,
        name: "Stephen Center Inc",
        address: "5217 South 28th Street, Omaha, NE 68107",
        phone: "(402) 715-5440",
        website: "http://www.stephencenter.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive treatment program for homeless individuals with substance use and mental health disorders in Douglas County.",
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
        id: 331,
        name: "Siena Francis House Miracles Treatment",
        address: "1111 North 17th Street, Omaha, NE 68102",
        phone: "(402) 341-1821",
        website: "http://www.sienafrancis.org",
        treatment_type: "Substance Abuse",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Substance abuse treatment program for homeless individuals in Douglas County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.270627,
            longitude: -95.9387778
        },
        intake_phone: "(402) 341-1821 ext. 1307"
    },
    {
        id: 332,
        name: "Douglas County Mental Health Center",
        address: "1490 North 16th Street, Omaha, NE 68102",
        phone: "(402) 444-1975",
        website: "http://cmhc.douglascounty-ne.gov",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "County-operated treatment program for substance use and mental health disorders in Douglas County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.272717,
            longitude: -95.9384233
        },
        secondary_phone: "(402) 444-1973"
    },
    {
        id: 333,
        name: "CenterPointe - Campus for Hope",
        address: "1490 North 16th Street, Omaha, NE 68102",
        phone: "(402) 827-0570",
        website: "http://www.centerpointe.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Comprehensive treatment program for co-occurring disorders in Douglas County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.2728323,
            longitude: -95.9377663
        }
    },
    {
        id: 334,
        name: "Santa Monica Inc",
        address: "2052 Deer Park Boulevard, Omaha, NE 68108",
        phone: "(402) 558-7088",
        website: "http://www.santamonicahouse.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Female",
        facility_type: "Treatment Center",
        description: "Women's treatment program for substance use and mental health disorders in Douglas County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.2286738,
            longitude: -95.9437227
        }
    },
    {
        id: 335,
        name: "Nebraska Urban Indian Health Coalition - Intertribal Treatment Center",
        address: "2226 North Street, Omaha, NE 68107",
        phone: "(402) 346-0902",
        website: "http://www.nuihc.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Co-ed",
        facility_type: "Treatment Center",
        description: "Culturally-specific treatment program for Native Americans with substance use and mental health disorders in Douglas County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.2099802,
            longitude: -95.9453188
        },
        secondary_phone: "(402) 706-0699"
    },
    {
        id: 336,
        name: "Open Door Mission - Men's Ministries",
        address: "2705 North 20th Street East, Omaha, NE 68110",
        phone: "(402) 422-1111",
        website: "http://www.opendoormission.org",
        treatment_type: "Both",
        age_group: "Adult",
        gender_served: "Male",
        facility_type: "Treatment Center",
        description: "Faith-based treatment program for men with substance use and mental health disorders in Douglas County.",
        availability_status: "Available",
        status_last_updated: "2025-05-20T10:00:00",
        county: "Douglas",
        coordinates: {
            latitude: 41.2836954,
            longitude: -95.9041594
        }
    }
];