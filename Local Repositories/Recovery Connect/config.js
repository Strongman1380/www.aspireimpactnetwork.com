// Firebase Database Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcp4pvdVEs5jG7yT7532BGzK0kf_aRQ1Q",
  authDomain: "lift-and-renewal-33bbb.firebaseapp.com",
  databaseURL: "https://lift-and-renewal-33bbb-default-rtdb.firebaseio.com", // Preserved for database operations
  projectId: "lift-and-renewal-33bbb",
  storageBucket: "lift-and-renewal-33bbb.firebasestorage.app",
  messagingSenderId: "945546956580",
  appId: "1:945546956580:web:25c1c89b1778201f31edb1",
  measurementId: "G-4QK3K2Z4SP"
};

// Legacy OpenAI config (now using AI SDK instead)
window.RECOVERY_CONFIG = {
  OPENAI_API_URL: "https://api.openai.com/v1/chat/completions",
  OPENAI_API_KEY: "your-api-key-here", // Not needed when using AI SDK
  RECOVERY_SPECIALIST_PROMPT: `You are a compassionate, knowledgeable Recovery Specialist with expertise in substance use disorders and mental health. 
  Your role is to provide evidence-based support, resources, and guidance to individuals in recovery. 
  Always maintain a non-judgmental, trauma-informed approach. Focus on harm reduction, motivational interviewing techniques, and relapse prevention strategies.
  Prioritize safety by immediately identifying crisis situations and providing appropriate resources.
  Never give medical advice, diagnose conditions, or replace professional treatment.
  Respond with empathy, validation, and practical, actionable guidance for recovery challenges.`
};

// Recovery Assistant Configuration
window.recoveryAssistant = {
  isProcessing: function() {
    return false; // Replace with actual implementation
  },
  
  detectCrisisKeywords: function(message) {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end my life', 'want to die',
      'harm myself', 'hurting myself', 'self-harm',
      'overdose', 'take too many', 'overdosing'
    ];
    
    const lowerMessage = message.toLowerCase();
    return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
  },
  
  getCrisisResponse: function() {
    return "I notice you've mentioned something concerning. If you're in crisis, please reach out to immediate help: Call the 988 Suicide & Crisis Lifeline (formerly known as the National Suicide Prevention Lifeline) at 988 or 1-800-273-8255, text HOME to the Crisis Text Line at 741741, or go to your nearest emergency room. These services are available 24/7, and there are trained professionals ready to help you right now.";
  },
  
  sendMessage: async function(message) {
    // Simulate response delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sample responses based on common recovery-related questions
    const responses = {
      "help": "I'm here to support your recovery journey. You can ask me about coping strategies, finding resources, or understanding substance use disorders.",
      "resources": "You can find local treatment options through our Treatment Locator, access 24/7 support through our Crisis Support services, or explore our comprehensive Resource Library.",
      "craving": "Cravings are temporary and will pass. Try the 5-minute rule: when a craving hits, commit to waiting 5 minutes before acting on it. During that time, distract yourself with a brief activity like walking, deep breathing, or calling a support person.",
      "relapse": "Relapse can be part of the recovery process. It doesn't mean failure—it's an opportunity to learn more about your triggers and strengthen your recovery plan. Be compassionate with yourself and reach out for help.",
      "meeting": "Finding a supportive community is vital for recovery. Our Community Chat offers 24/7 peer support, and our Resource Library can help you locate in-person meetings in your area.",
      "withdrawal": "Withdrawal symptoms can be challenging and sometimes dangerous. If you're experiencing severe symptoms, please consult with a medical professional immediately. Our Crisis Support line can help connect you with appropriate care.",
      "family": "Recovery affects the whole family system. We offer resources for family members in our Resource Library, including information on support groups like Al-Anon and Nar-Anon.",
      "default": "Thank you for sharing. Recovery is a personal journey, and I'm here to support you along the way. Would you like information about specific resources or coping strategies?"
    };
    
    // Simple keyword matching (in real implementation, would use more sophisticated NLP)
    const lowerMessage = message.toLowerCase();
    let response = responses.default;
    
    Object.keys(responses).forEach(key => {
      if (lowerMessage.includes(key) && key !== 'default') {
        response = responses[key];
      }
    });
    
    return response;
  }
};

// Database Connections
const dbConnections = {
  treatment: {
    endpoint: "https://lift-and-renewal-33bbb-default-rtdb.firebaseio.com/treatment.json",
    methods: ["GET", "POST"]
  },
  resources: {
    endpoint: "https://lift-and-renewal-33bbb-default-rtdb.firebaseio.com/resources.json",
    methods: ["GET"]
  },
  stories: {
    endpoint: "https://lift-and-renewal-33bbb-default-rtdb.firebaseio.com/stories.json",
    methods: ["GET"]
  },
  crisis: {
    endpoint: "https://lift-and-renewal-33bbb-default-rtdb.firebaseio.com/crisis.json",
    methods: ["GET"]
  }
};