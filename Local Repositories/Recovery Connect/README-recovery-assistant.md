# Recovery Assistant Setup Guide

The Recovery Connect website includes an AI-powered Recovery Specialist Assistant that provides professional, trauma-informed support to users in recovery. This assistant follows evidence-based practices and maintains appropriate boundaries.

## 🔧 Setup Instructions

### 1. Get Your OpenAI API Key
- Go to [OpenAI Platform](https://platform.openai.com/api-keys)
- Create an account or sign in
- Generate a new API key
- Copy your API key (keep it secure!)

### 2. Configure the Assistant
1. Open `/app/user_site/src/config.js`
2. Replace `'your-api-key-here'` with your actual OpenAI API key:

```javascript
OPENAI_API_KEY: 'sk-your-actual-api-key-here',
```

3. Save the file

### 3. Test the Assistant
- Open your website
- Click the robot icon to open the Recovery Specialist chat
- Send a message to test the AI responses

## 🎯 Features

### Recovery Specialist Behavior
- **Trauma-informed responses**: Uses person-first, non-stigmatizing language
- **Evidence-based guidance**: Incorporates CBT, DBT, and Motivational Interviewing techniques
- **Crisis detection**: Automatically detects crisis keywords and provides emergency resources
- **Professional boundaries**: Clearly defines what the assistant can and cannot do
- **Conversation memory**: Maintains context across the conversation

### Safety Features
- **Crisis intervention**: Detects self-harm language and immediately provides crisis resources
- **Professional referrals**: Appropriately refers clinical questions to licensed providers
- **Fallback responses**: Provides helpful responses when API is unavailable
- **Input validation**: Prevents inappropriate or harmful interactions

### Response Quality
- **Warm and affirming tone**: Professional yet compassionate communication style
- **Strength-based approach**: Emphasizes client autonomy and resilience
- **Practical suggestions**: Offers actionable coping strategies and resources
- **Conversational length**: Keeps responses under 200 words unless more detail is requested

## 🔒 Security Considerations

### API Key Protection
- Never commit your API key to version control
- Use environment variables in production
- Regularly rotate your API keys
- Monitor API usage for unusual activity

### User Privacy
- Conversations are not stored permanently
- No user identification is sent to OpenAI
- Crisis interventions are handled locally when possible
- Clear privacy policy covers AI interactions

## 🎨 Customization

### Modifying the Recovery Specialist Prompt
The system prompt is configured in `config.js` under `RECOVERY_SPECIALIST_PROMPT`. You can customize:
- Specific therapeutic approaches to emphasize
- Additional safety protocols
- Specialized knowledge areas
- Response style preferences

### Crisis Keywords
Crisis detection keywords can be modified in `recovery-assistant.js` in the `detectCrisisKeywords` method.

### Conversation History
The assistant maintains conversation context. You can adjust:
- `maxHistoryLength`: Number of message exchanges to remember
- Model parameters: temperature, max_tokens, etc.

## 📊 Monitoring

### Usage Tracking
- Monitor OpenAI API usage in your dashboard
- Track conversation metrics if needed
- Monitor for crisis interventions

### Error Handling
- API failures trigger fallback responses
- Network issues are handled gracefully
- Users always receive helpful responses

## 🆘 Crisis Resources

The assistant is configured to provide these crisis resources:
- **Emergency**: 911
- **Crisis Line**: 988 (Suicide & Crisis Lifeline)
- **Crisis Text**: Text HOME to 741741
- **SAMHSA**: 1-800-662-HELP

## 💰 Cost Management

### OpenAI Pricing
- GPT-3.5-turbo is cost-effective for most use cases
- Monitor token usage to control costs
- Set up usage alerts in OpenAI dashboard
- Consider rate limiting for high-traffic sites

### Optimization
- Conversation history is automatically managed
- Response length is limited to control costs
- Fallback responses reduce API dependency

## 🔄 Updates and Maintenance

### Regular Maintenance
- Update recovery resources periodically
- Review and refine the system prompt
- Monitor user feedback
- Update crisis resources as needed

### Model Updates
- OpenAI periodically updates models
- Test new models before switching
- Maintain compatibility with API changes

## 📞 Support

For technical support with the Recovery Assistant:
1. Check the browser console for error messages
2. Verify your API key is correctly configured
3. Test with a simple message first
4. Contact your development team for advanced issues

---

**Important**: This assistant provides peer support and educational information only. It is not a substitute for professional medical care, therapy, or crisis intervention services.