# Recovery Connect App Store Submission Guide

## Overview
This comprehensive guide will walk you through preparing and submitting your Recovery Connect app to both Google Play Store and Apple App Store using Capacitor to wrap your web application.

## Prerequisites Checklist
- ✅ Capacitor configuration (capacitor.config.ts) - **READY**
- ✅ PWA manifest (manifest.json) - **READY**
- ✅ Package.json with mobile scripts - **READY**
- ⚠️ App icons and splash screens - **NEEDS CREATION**
- ⚠️ Store screenshots - **NEEDS CREATION**
- ⚠️ Developer accounts - **NEEDS SETUP**

---

## Phase 1: Development Environment Setup

### 1.1 Install Required Dependencies
```bash
# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Install project dependencies
npm install

# Verify Capacitor installation
npx cap doctor
```

### 1.2 Add Platform Support
```bash
# Add Android platform
npx cap add android

# Add iOS platform (requires macOS)
npx cap add ios

# Sync web assets to native projects
npx cap sync
```

### 1.3 Build and Test
```bash
# Build your web app
npm run build

# Copy to native platforms
npx cap copy

# Open in Android Studio
npx cap open android

# Open in Xcode (macOS only)
npx cap open ios
```

---

## Phase 2: App Assets Creation

### 2.1 App Icons Required

#### Android Icon Sizes
Create these PNG files in `android/app/src/main/res/` folders:
- `mipmap-mdpi/ic_launcher.png` - 48x48px
- `mipmap-hdpi/ic_launcher.png` - 72x72px
- `mipmap-xhdpi/ic_launcher.png` - 96x96px
- `mipmap-xxhdpi/ic_launcher.png` - 144x144px
- `mipmap-xxxhdpi/ic_launcher.png` - 192x192px

#### iOS Icon Sizes
Create these PNG files for iOS:
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- Icon-20.png (20x20px)
- Icon-29.png (29x29px)
- Icon-40.png (40x40px)
- Icon-58.png (58x58px)
- Icon-60.png (60x60px)
- Icon-80.png (80x80px)
- Icon-87.png (87x87px)
- Icon-120.png (120x120px)
- Icon-180.png (180x180px)
- Icon-1024.png (1024x1024px)

### 2.2 Splash Screens

#### Android Splash
Create these in `android/app/src/main/res/drawable/`:
- `splash.png` - 2048x2048px (will be centered)

#### iOS Splash
Create in `ios/App/App/Assets.xcassets/Splash.imageset/`:
- `splash-2048x2048.png`

### 2.3 Store Screenshots Required

#### Google Play Store Screenshots
- **Phone Screenshots**: 16:9 or 9:16 ratio, minimum 1080px
- **7-inch Tablet**: 16:10 or 10:16 ratio
- **10-inch Tablet**: 16:10 or 10:16 ratio
- **Feature Graphic**: 1024x500px
- **App Icon**: 512x512px

#### Apple App Store Screenshots
- **iPhone Screenshots**: 
  - iPhone 6.7" Display: 1290x2796px
  - iPhone 6.5" Display: 1284x2778px
  - iPhone 5.5" Display: 1242x2208px
- **iPad Screenshots**:
  - iPad Pro (12.9"): 2048x2732px
  - iPad Pro (11"): 1668x2388px

---

## Phase 3: Store Account Setup

### 3.1 Google Play Console
1. Visit [Google Play Console](https://play.google.com/console)
2. Create developer account ($25 one-time fee)
3. Complete identity verification
4. Accept Developer Distribution Agreement

### 3.2 Apple Developer Program
1. Visit [Apple Developer](https://developer.apple.com)
2. Enroll in Apple Developer Program ($99/year)
3. Complete identity verification
4. Accept agreements

---

## Phase 4: App Configuration for Stores

### 4.1 Update Capacitor Config for Production
```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recoveryconnect.app',
  appName: 'Recovery Connect',
  webDir: 'dist', // Change to build output directory
  server: {
    androidScheme: 'https'
  },
  // ... rest of your config
};
```

### 4.2 Update Package.json Version
```json
{
  "version": "1.0.0", // Increment for each release
  "versionCode": 1     // Android version code
}
```

### 4.3 Android Build Configuration
Update `android/app/build.gradle`:
```gradle
android {
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.recoveryconnect.app"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
        // ... other config
    }
}
```

---

## Phase 5: Building Release Apps

### 5.1 Android Release Build

#### Generate Signing Key
```bash
# Generate a signing key
keytool -genkey -v -keystore recovery-connect-release.keystore -alias recovery-connect -keyalg RSA -keysize 2048 -validity 10000

# Store keystore securely - you'll need it for all future updates!
```

#### Configure Signing in Android Studio
1. Open `android/` folder in Android Studio
2. Go to Build → Generate Signed Bundle/APK
3. Select "Android App Bundle" (recommended) or APK
4. Create new keystore or use existing
5. Fill in keystore details
6. Select "release" build variant
7. Build signed bundle

#### Alternative: Command Line Build
```bash
# Generate release AAB
cd android
./gradlew bundleRelease

# Generated file: android/app/build/outputs/bundle/release/app-release.aab
```

### 5.2 iOS Release Build

#### Xcode Configuration
1. Open `ios/App/App.xcworkspace` in Xcode
2. Select "Recovery Connect" scheme
3. Select "Any iOS Device" as target
4. Go to Product → Archive
5. When archive completes, click "Distribute App"
6. Select "App Store Connect"
7. Follow upload wizard

---

## Phase 6: Store Listing Information

### 6.1 App Store Listing Details

#### App Title
"Recovery Connect - Mental Health & Addiction Support"

#### Short Description (Google Play - 80 chars)
"Comprehensive recovery tools, meditation guides & crisis support for sobriety"

#### Full Description Template
```
🌟 RECOVERY CONNECT - YOUR COMPANION FOR HEALING 🌟

Recovery Connect is a comprehensive mental health and addiction recovery support platform designed to empower your journey to wellness. Our evidence-based tools and trauma-informed approach provide the support you need, when you need it.

🧘 MINDFULNESS & MEDITATION
• Guided meditation sessions for recovery
• Morning intention setting
• Stress relief techniques
• Craving management tools
• Evening gratitude practice

📊 PROGRESS TRACKING
• Sobriety milestone tracker
• Daily mood and wellness logging
• Recovery goal setting
• Progress visualization
• Achievement celebrations

🛠️ RECOVERY TOOLS
• Interactive mental health assessments
• CBT (Cognitive Behavioral Therapy) tools
• Trigger identification and management
• Coping skills development
• Recovery planning templates

👥 COMMUNITY SUPPORT
• Peer mentorship connections
• Recovery stories and inspiration
• Community guidelines for safe spaces
• Support group integration

🆘 CRISIS SUPPORT
• 24/7 crisis resource access
• Emergency contact integration
• National helpline connections
• Safety planning tools

🔒 PRIVACY FOCUSED
• Local data storage
• No external data transmission
• HIPAA-conscious design
• Anonymous usage options

✨ KEY FEATURES
• Offline functionality
• Trauma-informed design
• Evidence-based practices
• Professional-grade resources
• Accessibility compliant
• Multi-language support

Recovery Connect prioritizes your privacy and safety while providing professional-quality tools used by counselors and recovery specialists. Whether you're in early recovery, maintaining long-term sobriety, or supporting a loved one, our platform offers the resources you need.

Start your healing journey today with Recovery Connect - because every step forward matters.

📞 Crisis Support: If you're in crisis, call 988 (Suicide & Crisis Lifeline) or visit your nearest emergency room.

⚠️ Medical Disclaimer: This app is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
```

#### Keywords (Google Play)
```
recovery, sobriety, addiction, mental health, meditation, mindfulness, CBT, therapy, crisis support, peer support, wellness, healing, trauma, PTSD, anxiety, depression, substance abuse, sober, AA, NA, self-help, therapy tools, mood tracker, addiction recovery, support groups
```

#### App Categories
- **Primary**: Health & Fitness
- **Secondary**: Medical, Lifestyle

### 6.2 Content Rating

#### Google Play Content Rating
- Target Age Group: Teen (13+)
- Content Descriptors:
  - Discusses mental health topics
  - References to addiction and substance use
  - Crisis and emergency content
  - Educational medical content

#### Apple App Store Rating
- Age Rating: 12+ (due to medical/mental health content)
- Content Descriptors:
  - Infrequent/Mild Medical/Treatment Information
  - Infrequent/Mild Mature/Suggestive Themes

---

## Phase 7: Store Submission Process

### 7.1 Google Play Store Submission

#### Create App Listing
1. Go to Google Play Console
2. Click "Create app"
3. Fill in app details:
   - App name: "Recovery Connect"
   - Default language: English (US)
   - App or game: App
   - Free or paid: Free
   - Category: Health & Fitness

#### Upload App Bundle
1. Go to "Release" → "Production"
2. Click "Create new release"
3. Upload your signed AAB file
4. Add release notes
5. Review and roll out

#### Store Listing
1. Upload app icon (512x512px)
2. Upload feature graphic (1024x500px)
3. Upload screenshots (at least 2, max 8)
4. Add app description
5. Fill in content rating questionnaire
6. Add privacy policy URL
7. Set pricing (Free)

#### Review Process
- Initial review: 3-7 days
- Updates: 1-3 days
- Possible rejection reasons to avoid:
  - Missing privacy policy
  - Inappropriate content
  - Technical issues
  - Metadata violations

### 7.2 Apple App Store Submission

#### App Store Connect Setup
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in app information:
   - Platform: iOS
   - Name: Recovery Connect
   - Bundle ID: com.recoveryconnect.app
   - SKU: recovery-connect-ios
   - User Access: Full Access

#### App Information
1. Upload app icon (1024x1024px)
2. Add app description
3. Upload screenshots for all device types
4. Set keywords (max 100 characters)
5. Set support URL and privacy policy URL
6. Fill in app review information

#### Upload Build
1. Use Xcode to upload build to App Store Connect
2. Once processed, select build in App Store Connect
3. Add "What's New in This Version"
4. Submit for review

#### Review Process
- Review time: 24-48 hours (current average)
- Possible rejection reasons:
  - Guideline violations
  - Technical issues
  - Missing information
  - Content concerns

---

## Phase 8: Post-Submission

### 8.1 Monitoring & Analytics
- Set up Google Play Console analytics
- Configure App Store Connect analytics
- Monitor crash reports
- Track user reviews and ratings

### 8.2 Updates Process
```bash
# For updates:
1. Increment version number in package.json
2. Build new release
3. Upload to respective stores
4. Add release notes describing changes
```

### 8.3 Marketing Preparation
- Prepare app store optimization (ASO)
- Create promotional materials
- Plan social media announcements
- Prepare press kit

---

## Phase 9: Compliance & Legal

### 9.1 Privacy Policy Requirements
Your app handles sensitive mental health data, so ensure your privacy policy covers:
- Data collection practices
- Data storage and security
- User rights and choices
- Third-party services
- HIPAA compliance considerations
- Crisis intervention protocols

### 9.2 Medical Disclaimers
Include clear disclaimers:
- Not a substitute for professional medical care
- Emergency situations require immediate professional help
- App is for informational and supportive purposes only

### 9.3 Content Guidelines
- Ensure all content is evidence-based
- Include appropriate trigger warnings
- Provide crisis resources prominently
- Maintain trauma-informed language

---

## Phase 10: Testing Checklist

### 10.1 Functionality Testing
- [ ] All features work offline
- [ ] Data persistence works correctly
- [ ] Navigation functions properly
- [ ] Forms submit correctly
- [ ] Media playback works
- [ ] Crisis resources are accessible

### 10.2 Device Testing
- [ ] Test on various Android devices/versions
- [ ] Test on various iOS devices/versions
- [ ] Test different screen sizes
- [ ] Test with accessibility features enabled
- [ ] Test with poor network conditions

### 10.3 Store Compliance Testing
- [ ] App meets minimum functionality requirements
- [ ] All links work correctly
- [ ] Privacy policy is accessible
- [ ] Terms of service are available
- [ ] Content rating is appropriate
- [ ] No prohibited content included

---

## Emergency Contacts & Resources

### Developer Support
- **Google Play Console Help**: [support.google.com/googleplay](https://support.google.com/googleplay)
- **Apple Developer Support**: [developer.apple.com/support](https://developer.apple.com/support)
- **Capacitor Documentation**: [capacitorjs.com/docs](https://capacitorjs.com/docs)

### Crisis Resources (for app content)
- **988 Suicide & Crisis Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **SAMHSA National Helpline**: 1-800-662-4357

---

## Estimated Timeline

| Phase | Duration | Notes |
|-------|----------|-------|
| Asset Creation | 3-5 days | Icons, screenshots, descriptions |
| Developer Account Setup | 1-2 days | Verification may take longer |
| App Building & Testing | 2-3 days | Include device testing |
| Store Submission | 1 day | Actual submission process |
| Review Process | 1-7 days | Google: 3-7 days, Apple: 1-2 days |
| **Total Timeline** | **7-18 days** | Excluding development time |

---

## Success Metrics to Track

### Initial Launch (First 30 days)
- Download numbers
- User retention rates
- Crash-free sessions
- User ratings and reviews
- Feature usage analytics

### Ongoing Success
- Monthly active users
- Session duration
- Feature adoption rates
- User feedback sentiment
- Store ranking position

---

## Cost Summary

| Item | Google Play | Apple App Store |
|------|-------------|-----------------|
| Developer Account | $25 (one-time) | $99 (annual) |
| App Submission | Free | Free |
| **Total Year 1** | **$25** | **$99** |
| **Annual Renewal** | **$0** | **$99** |

---

## Next Steps

1. **Immediate Actions**:
   - Create app icons and splash screens
   - Take app screenshots
   - Set up developer accounts
   - Test builds on physical devices

2. **Before Submission**:
   - Complete final testing
   - Prepare all store assets
   - Review compliance requirements
   - Create backup plans for rejected submissions

3. **Post-Launch**:
   - Monitor user feedback
   - Plan first update cycle
   - Implement analytics tracking
   - Prepare marketing materials

---

*This guide is specifically tailored for Recovery Connect and should be updated as store requirements change. Always check the latest store guidelines before submission.*