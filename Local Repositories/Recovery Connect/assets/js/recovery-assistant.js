/**
 * Recovery Companion AI Class
 * Your supportive roommate who gets it - real talk, real support
 */
class RecoveryCompanion {
    constructor() {
        this.conversationHistory = [];
        this.isLoading = false;
        this.userName = localStorage.getItem('recovery_user_name') || 'friend';
        
        console.log('🤗 Hey there! Sam (your recovery roommate) is here and ready to chat');
    }

    /**
     * Check if AI is currently processing a message
     */
    isProcessing() {
        return this.isLoading;
    }

    /**
     * Get user name for personalized responses
     */
    getUserName() {
        return this.userName;
    }

    /**
     * Main method to send message and get real, supportive response
     */
    async sendMessage(userMessage) {
        const startTime = Date.now();
        
        try {
            this.isLoading = true;
            
            console.log('💬 Message from you:', {
                message: userMessage.substring(0, 100) + '...',
                timestamp: new Date().toISOString()
            });

            // Check AI SDK availability when actually needed
            if (!window.aiSdk || !window.ywConfig) {
                console.error('❌ AI not available right now - using backup responses');
                return this.getFallbackResponse({ isStruggling: true, riskLevel: 'medium' });
            }

            // Figure out what kind of support you need right now
            const messageAnalysis = this.analyzeMessage(userMessage);
            console.log('🧠 Understanding your message:', messageAnalysis);

            // Choose the right kind of response based on what you're going through
            let sceneName = 'recovery_companion';
            if (messageAnalysis.isCrisis) {
                sceneName = 'crisis_intervention';
            } else if (messageAnalysis.isRelapse) {
                sceneName = 'relapse_support';
            }

            // Add your message to our chat with validation
            if (userMessage && userMessage.trim().length > 0) {
                this.conversationHistory.push({
                    role: 'user',
                    content: userMessage.trim()
                });
            }

            const response = await this.generateAIResponse(userMessage, sceneName, messageAnalysis);

            // Add my response to our chat with validation
            if (response && response.trim().length > 0) {
                this.conversationHistory.push({
                    role: 'assistant',
                    content: response.trim()
                });
            }

            // Keep our chat history manageable
            this.manageConversationHistory();

            console.log('✅ Response ready:', {
                responseLength: response.length,
                sceneName: sceneName,
                processingTime: `${Date.now() - startTime}ms`
            });

            return response;

        } catch (error) {
            console.error('❌ Something went wrong with AI:', {
                error: error.message,
                processingTime: `${Date.now() - startTime}ms`
            });
            
            // Always have your back with a real response
            return this.getFallbackResponse({ isStruggling: true, riskLevel: 'medium' });
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Read between the lines - understanding where you're at emotionally
     */
    analyzeMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        const crisisKeywords = [
            'suicide', 'kill myself', 'end it all', 'not worth living', 'want to die',
            'better off dead', 'no point', 'give up', 'can\'t go on', 'worthless',
            'done with everything', 'nobody would care', 'tired of fighting'
        ];
        
        const relapseKeywords = [
            'relapsed', 'used again', 'broke my sobriety', 'drank today', 'got high',
            'couldn\'t resist', 'gave in', 'started again', 'back to using',
            'failed again', 'lost my streak', 'messed up', 'slipped up'
        ];
        
        const struggleKeywords = [
            'struggling', 'hard time', 'difficult', 'tempted', 'craving',
            'urge', 'want to use', 'thinking about drinking', 'stressed',
            'overwhelmed', 'lonely', 'depressed', 'anxious', 'triggering',
            'rough day', 'tough', 'don\'t know', 'lost', 'scared'
        ];

        const isCrisis = crisisKeywords.some(keyword => lowerMessage.includes(keyword));
        const isRelapse = relapseKeywords.some(keyword => lowerMessage.includes(keyword));
        const isStruggling = struggleKeywords.some(keyword => lowerMessage.includes(keyword));

        return {
            isCrisis,
            isRelapse,
            isStruggling,
            riskLevel: isCrisis ? 'high' : isRelapse ? 'medium-high' : isStruggling ? 'medium' : 'low'
        };
    }

    /**
     * Generate response using AI - your supportive roommate Sam
     */
    async generateAIResponse(userMessage, sceneName, messageAnalysis) {
        if (!window.ywConfig?.ai_config?.[sceneName]) {
            console.error('❌ AI config missing:', sceneName);
            throw new Error(`AI setup issue with '${sceneName}'`);
        }

        const config = window.ywConfig.ai_config[sceneName];
        
        // Set up context for more personal responses
        const promptVariables = {
            userName: this.userName,
            currentTime: new Date().toLocaleString(),
            riskLevel: messageAnalysis.riskLevel,
            isFirstTime: this.conversationHistory.length <= 1,
            dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' })
        };

        // Use system prompt template with variables - handle both function and string types
        let systemPrompt;
        if (typeof config.system_prompt === 'function') {
            systemPrompt = config.system_prompt(promptVariables);
        } else if (typeof config.system_prompt === 'string') {
            systemPrompt = this.interpolateTemplate(config.system_prompt, promptVariables);
        } else {
            systemPrompt = '';
        }

        console.log('🤖 Generating response:', {
            model: config.model,
            scene: sceneName,
            riskLevel: messageAnalysis.riskLevel,
            conversationLength: this.conversationHistory.length
        });

        const openai = window.aiSdk.openai.createOpenAI({
            baseURL: 'https://api.youware.com/public/v1/ai',
            apiKey: 'sk-YOUWARE'
        });

        // Ensure all messages have proper format - declare outside try block
        const messages = [];

        try {
            // Add system message if available and valid
            if (systemPrompt && typeof systemPrompt === 'string' && systemPrompt.trim().length > 0) {
                messages.push({ role: 'system', content: systemPrompt.trim() });
            }
            
            // Add conversation history with validation
            this.conversationHistory.forEach(msg => {
                if (msg.role && msg.content && msg.content.trim().length > 0) {
                    messages.push({
                        role: msg.role,
                        content: msg.content.trim()
                    });
                }
            });

            console.log('🤖 Sending messages to AI:', {
                messageCount: messages.length,
                systemPromptLength: systemPrompt ? systemPrompt.length : 0,
                historyLength: this.conversationHistory.length
            });

            const { text } = await window.aiSdk.ai.generateText({
                model: openai(config.model),
                messages: messages,
                temperature: config.temperature || 0.8,
                maxTokens: config.maxTokens || 2000
            });

            console.log('✅ Got response from Sam:', {
                model: config.model,
                scene: sceneName,
                outputLength: text.length
            });

            return text;
        } catch (error) {
            console.error('❌ AI response failed:', {
                model: config.model,
                scene: sceneName,
                error: error.message,
                errorDetails: error,
                messageCount: messages.length,
                systemPromptUsed: !!systemPrompt
            });
            
            // Provide more specific error information
            let errorMessage = 'AI response failed';
            if (error.message.includes('messages must be an array')) {
                errorMessage = 'Message formatting error - please try again';
            } else if (error.message.includes('Invalid prompt')) {
                errorMessage = 'Prompt validation error - message format issue';
            } else if (error.message.includes('content')) {
                errorMessage = 'Message content error - please rephrase your message';
            }
            
            throw new Error(`${errorMessage}: ${error.message}`);
        }
    }

    /**
     * Interpolate template strings with variables
     */
    interpolateTemplate(template, variables) {
        return template.replace(/\$\{(\w+)\}/g, (match, key) => {
            return variables[key] || match;
        });
    }

    /**
     * Crisis response - when you really need immediate help
     */
    getImmediateCrisisResponse() {
        return `Hey ${this.userName}, I'm really worried about you right now. What you're feeling is real and valid, but I want you to know that there are people who can help you through this moment.

**Please reach out right now:**
• **Call 988** - They're amazing and available 24/7
• **Text HOME to 741741** - Crisis text line if talking feels too hard
• **Call 911** if you're in immediate danger
• **Go to your nearest ER** - they understand and won't judge

I've been in dark places too. This feeling will pass, even when it doesn't feel like it will. You matter more than you know.

Can you call one of those numbers right now? Or is there someone who can come sit with you?`;
    }

    /**
     * Backup responses when AI isn't available - still real and supportive
     */
    getFallbackResponse(analysis) {
        if (analysis.isCrisis) {
            return this.getImmediateCrisisResponse();
        }

        if (analysis.isRelapse) {
            return `Hey ${this.userName}, first off - thank you for telling me. That took guts.

I've been exactly where you are right now. That shame, that feeling like you threw everything away? I get it. But here's what I learned: this doesn't erase your progress. It doesn't make you weak. It makes you human.

**Right now, let's just focus on today:**
• You reached out instead of hiding - that's huge
• Tomorrow is a fresh start, no questions asked
• Your recovery journey isn't over, it's just had a detour

**What you need:**
• SAMHSA: 1-800-662-4357 (they're non-judgmental and helpful)
• Your sponsor or support person if you have one
• Maybe a meeting today if you're up for it

You wanna talk about what happened, or should we focus on getting through the rest of today? I'm here either way.`;
        }

        return `Hey there ${this.userName}! 💙 

I'm Sam, think of me as that roommate who's been through recovery and actually gets what you're going through. No judgment here, just real talk and support.

**I'm here for whatever you need:**
• Good days when you want to celebrate
• Rough days when everything feels hard
• Those in-between days when you're just trying to figure it out
• Questions about recovery, cravings, or just life stuff

What's going on with you today? How are you really doing?`;
    }

    /**
     * Keep our conversation manageable but meaningful
     */
    manageConversationHistory() {
        const maxHistory = 12; // A bit more room for deeper conversations
        if (this.conversationHistory.length > maxHistory) {
            this.conversationHistory = this.conversationHistory.slice(-maxHistory);
        }
    }

    /**
     * Set your name so I can be more personal
     */
    setUserName(name) {
        this.userName = name || 'friend';
        localStorage.setItem('recovery_user_name', this.userName);
        console.log(`👋 Got it, I'll call you ${this.userName}`);
    }

    /**
     * Start fresh if you want
     */
    clearHistory() {
        this.conversationHistory = [];
        console.log('🗑️ Chat history cleared - fresh start!');
    }

    /**
     * Check if I'm thinking of a response
     */
    getLoadingState() {
        return this.isLoading;
    }

    /**
     * Test all my different response modes
     */
    async testConfigurations() {
        const testMessages = {
            recovery_companion: "Hey Sam, having a rough day but trying to stay positive.",
            relapse_support: "I messed up yesterday and used again. Feel terrible.",
            crisis_intervention: "I'm having thoughts about not wanting to be here anymore."
        };

        console.log('🧪 Testing my response modes...');
        
        for (const [sceneName, testMessage] of Object.entries(testMessages)) {
            try {
                console.log(`Testing ${sceneName}...`);
                const response = await this.sendMessage(testMessage);
                console.log(`✅ ${sceneName} working: ${response.substring(0, 100)}...`);
                this.clearHistory(); // Clear between tests
            } catch (error) {
                console.error(`❌ ${sceneName} failed:`, error.message);
            }
        }
    }
}

// Make Sam available everywhere
window.recoveryCompanion = new RecoveryCompanion();

console.log('✅ Sam is here and ready to chat - your recovery roommate is online!');