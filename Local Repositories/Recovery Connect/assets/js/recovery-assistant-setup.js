/**
 * Recovery Assistant Setup - Handles initialization and configuration
 * Enhanced for YouWare AI SDK integration with embedded configuration
 */

// Embedded configuration for local development
const EMBEDDED_CONFIG = {
    "ai_config": {
        "recovery_companion": {
            "model": "claude-4-sonnet",
            "temperature": 0.8,
            "maxTokens": 2000,
            "system_prompt": "You are Alex, a compassionate AI recovery companion with years of experience in addiction counseling and peer support. You understand that recovery is a journey with ups and downs, and relapses are often part of the healing process - not failures.\n\nYour personality: Warm, non-judgmental, experienced, hopeful, and practical. You speak like a trusted friend who truly understands the struggles of recovery.\n\nWhen someone mentions a relapse or using substances:\n1. NEVER shame or judge - respond with compassion and understanding\n2. Acknowledge their honesty and courage in sharing\n3. Remind them that relapse doesn't erase their progress or define them\n4. Provide immediate, actionable steps they can take RIGHT NOW\n5. Offer specific resources (hotlines, meeting locators, crisis support)\n6. Stay with them emotionally through the conversation\n7. Focus on getting them through the next hour, then the next day\n\nIMMEDIATE RELAPSE RESPONSE PROTOCOL:\n- Validate their feelings without minimizing the situation\n- Provide 3-5 concrete actions they can take immediately\n- Share relevant crisis resources and phone numbers\n- Encourage them to reach out to their support network\n- Remind them of their reasons for recovery\n- Offer to continue talking as long as they need\n\nCRISIS RESOURCES to share when appropriate:\n- SAMHSA National Helpline: 1-800-662-4357 (24/7)\n- Crisis Text Line: Text HOME to 741741\n- Suicide & Crisis Lifeline: 988\n- AA Hotline: Check local listings\n- NA Hotline: Check local listings\n\nRemember: Your goal is to be their supportive companion who helps them navigate through difficult moments with practical guidance, emotional support, and hope for tomorrow."
        },
        "relapse_support": {
            "model": "openai-gpt-4o",
            "temperature": 0.7,
            "maxTokens": 1500,
            "system_prompt": "You are responding to someone who has just relapsed or is in immediate crisis. Your role is to provide:\n1. Immediate emotional support and validation\n2. Practical steps they can take RIGHT NOW\n3. Crisis resources and phone numbers\n4. Hope and perspective on their recovery journey\n\nBe direct but gentle. Focus on immediate action and safety. Include specific phone numbers and resources they can access immediately."
        },
        "crisis_intervention": {
            "model": "gemini-2.5-pro",
            "temperature": 0.6,
            "maxTokens": 1200,
            "system_prompt": "CRISIS INTERVENTION MODE: The user has indicated severe crisis, suicidal thoughts, or immediate danger. Your response must:\n1. Express immediate concern for their safety\n2. Provide emergency contact information\n3. Encourage them to seek immediate professional help\n4. Stay calm and supportive while emphasizing urgency\n5. NOT attempt to provide therapy or counseling\n6. Direct them to appropriate crisis resources\n\nAlways include: 911 for emergencies, 988 for suicide crisis, and encourage them to go to nearest ER if in immediate danger."
        }
    }
};

// Load configuration 
function loadConfiguration() {
    try {
        console.log('🔧 Loading Recovery Companion configuration...');
        
        // Use embedded configuration
        if (!window.ywConfig) {
            window.ywConfig = EMBEDDED_CONFIG;
            console.log('✅ Embedded configuration loaded successfully');
        }
        
        // Verify AI SDK availability
        if (window.aiSdk && window.aiSdk.ai && window.aiSdk.openai) {
            console.log('✅ AI SDK verified and ready');
            if (window.recoveryCompanion) {
                window.recoveryCompanion.fallbackMode = false;
            }
        } else {
            console.warn('⚠️ AI SDK not fully available, using fallback mode');
            if (window.recoveryCompanion) {
                window.recoveryCompanion.fallbackMode = true;
            }
        }
        
        console.log('🤗 Recovery Companion fully initialized and ready');
        
    } catch (error) {
        console.error('❌ Configuration loading failed:', error);
        if (window.recoveryCompanion) {
            window.recoveryCompanion.fallbackMode = true;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Recovery Companion setup starting...');
    
    // Load configuration immediately
    loadConfiguration();
    
    // Add some helpful global functions for testing
    window.testRelapseResponse = async function() {
        const testMessage = "I relapsed last night and I feel terrible about it";
        console.log('🧪 Testing relapse response with message:', testMessage);
        
        try {
            const response = await window.recoveryCompanion.sendMessage(testMessage);
            console.log('🤖 Test response:', response);
            return response;
        } catch (error) {
            console.error('❌ Test failed:', error);
            return null;
        }
    };
    
    window.testCrisisResponse = async function() {
        const testMessage = "I'm thinking about ending my life";
        console.log('🆘 Testing crisis response with message:', testMessage);
        
        try {
            const response = await window.recoveryCompanion.sendMessage(testMessage);
            console.log('🤖 Test response:', response);
            return response;
        } catch (error) {
            console.error('❌ Test failed:', error);
            return null;
        }
    };
    
    window.testNormalChat = async function() {
        const testMessage = "Hi, I'm having a difficult day today";
        console.log('💬 Testing normal chat with message:', testMessage);
        
        try {
            const response = await window.recoveryCompanion.sendMessage(testMessage);
            console.log('🤖 Test response:', response);
            return response;
        } catch (error) {
            console.error('❌ Test failed:', error);
            return null;
        }
    };
    
    // Set user name if provided in localStorage
    const savedName = localStorage.getItem('recovery_user_name');
    if (savedName && window.recoveryCompanion) {
        window.recoveryCompanion.setUserName(savedName);
        console.log(`💙 Welcome back, ${savedName}!`);
    }
    
    // Test configuration after a short delay
    setTimeout(() => {
        if (window.ywConfig && window.ywConfig.ai_config) {
            console.log('🎯 Configuration test: Available AI scenes:', Object.keys(window.ywConfig.ai_config));
        }
    }, 1000);
});

// Export for testing
window.loadConfiguration = loadConfiguration;