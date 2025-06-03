/**
 * Configuration settings for Recovery Connect
 */

const CONFIG = {
    // Site information
    SITE_NAME: "Recovery Connect",
    SITE_DESCRIPTION: "Supporting your journey to recovery",
    
    // Contact information
    CONTACT_EMAIL: "support@recoveryconnect.org",
    
    // Emergency resources
    EMERGENCY_RESOURCES: {
        SUICIDE_PREVENTION: {
            name: "National Suicide Prevention Lifeline",
            phone: "988",
            url: "https://988lifeline.org/"
        },
        CRISIS_TEXT: {
            name: "Crisis Text Line",
            text: "HOME to 741741",
            url: "https://www.crisistextline.org/"
        },
        SAMHSA: {
            name: "SAMHSA's National Helpline",
            phone: "1-800-662-4357",
            url: "https://www.samhsa.gov/find-help/national-helpline"
        }
    },
    
    // Feature flags
    FEATURES: {
        EMERGENCY_BANNER: true,
        ACCESSIBILITY_TOOLS: true,
        COMMUNITY_CHAT: false, // Not yet implemented
        ACCOUNT_SYSTEM: false  // Not yet implemented
    }
};