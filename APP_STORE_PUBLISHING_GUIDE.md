# App Store Publishing Guide - Pulse of People

## Overview
This guide will help you publish the Pulse of People mobile app to the Apple App Store.

## Prerequisites

### 1. Apple Developer Account
- Cost: $99/year
- Sign up at: https://developer.apple.com/programs/
- **Status**: ⚠️ You must have an active Apple Developer account

### 2. App Assets Required

#### App Icon
- **Size**: 1024x1024 pixels
- **Format**: PNG (no transparency)
- **Location**: `./assets/icon.png`
- **Status**: ✅ Already exists

#### Screenshots (Required for App Store)
You need screenshots for different iPhone sizes:
- **6.9" Display** (iPhone 16 Pro Max): 1320 x 2868 pixels (3 screenshots minimum)
- **6.7" Display** (iPhone 14 Pro Max): 1290 x 2796 pixels
- **6.5" Display** (iPhone 11 Pro Max): 1284 x 2778 pixels

**How to capture:**
1. Run app on iPhone or simulator
2. Take screenshots of key screens (Dashboard, Login, Analytics, Profile)
3. Save them in a new folder: `./app-store-assets/screenshots/`

#### App Store Description

**App Name**: Pulse of People

**Subtitle** (30 characters max):
"Political Intelligence Platform"

**Description** (4000 characters max):
```
Pulse of People is a comprehensive political intelligence and voter engagement platform designed for modern political campaigns and civic organizations.

KEY FEATURES:

📊 Real-Time Analytics
• Monitor sentiment trends across multiple channels
• Track campaign performance with detailed metrics
• Visualize voter demographics and engagement patterns

👥 Voter Database Management
• Organize and segment voter information
• Track voter interactions and preferences
• Smart targeting based on demographics and behavior

📱 Social Media Monitoring
• Track mentions and engagement across platforms
• Analyze sentiment from social media conversations
• Monitor competitor activity

📋 Field Operations
• Submit field reports in real-time
• Track ground-level campaign activities
• Coordinate volunteer efforts efficiently

🤖 AI-Powered Insights
• Get intelligent recommendations for campaign strategy
• Predictive analytics for voter turnout
• Automated trend detection and alerts

🔔 Smart Alerts
• Real-time notifications for critical events
• Custom alert rules for your campaign needs
• Priority-based alert management

PERFECT FOR:
• Political campaigns at all levels
• Civic engagement organizations
• Political consultants and strategists
• Volunteer coordinators
• Campaign managers

SECURITY & PRIVACY:
• Enterprise-grade security
• Role-based access control
• Secure data encryption
• GDPR and privacy law compliant

Transform your political campaign with data-driven insights and modern tools. Download Pulse of People today!
```

**Keywords** (100 characters max):
political,campaign,voter,analytics,election,civic,democracy,poll,survey,sentiment

**Support URL**: https://pulseofpeople.com/support (you'll need to create this)

**Marketing URL**: https://pulseofpeople.com (you'll need to create this)

**Privacy Policy URL**: https://pulseofpeople.com/privacy (REQUIRED - see below)

#### Privacy Policy
You MUST have a privacy policy. Create a simple one at:
- https://www.privacypolicygenerator.info/
- Or use: https://www.freeprivacypolicy.com/

Key points to include:
- What data you collect (email, name, location if using GPS)
- How you use the data
- Third-party services (Supabase, ElevenLabs, Google Gemini)
- User rights
- Contact information

## Step-by-Step Publishing Process

### Step 1: Prepare App Configuration

Update version and build number in `app.config.js`:
```javascript
version: "1.0.0",
ios: {
  buildNumber: "1",
  ...
}
```

### Step 2: Build Production App

Run this command to build for App Store:
```bash
eas build --platform ios --profile production
```

This will:
1. Upload your code to EAS servers
2. Build the app in the cloud
3. Generate an `.ipa` file
4. Take approximately 15-30 minutes

### Step 3: Create App in App Store Connect

1. Go to: https://appstoreconnect.apple.com/
2. Click "My Apps" → "+" → "New App"
3. Fill in details:
   - **Platforms**: iOS
   - **Name**: Pulse of People
   - **Primary Language**: English
   - **Bundle ID**: com.pulseofpeople.voter
   - **SKU**: pulseofpeople2025 (unique identifier)
   - **User Access**: Full Access

### Step 4: Upload App Binary

After EAS build completes:

**Option A: Using EAS Submit (Recommended)**
```bash
eas submit --platform ios --latest
```

**Option B: Manual Upload via Transporter**
1. Download Transporter app from Mac App Store
2. Download the .ipa file from EAS build page
3. Drag .ipa into Transporter
4. Click "Deliver"

### Step 5: Complete App Store Connect Listing

In App Store Connect, fill in all required information:

#### 1. App Information
- Category: Productivity or Business
- Content Rights: Check if you own/licensed all content

#### 2. Pricing and Availability
- Price: Free
- Availability: All countries (or select specific ones)

#### 3. App Privacy
Answer questions about data collection:
- Do you collect data? Yes
- Data types: Name, Email, Location (if using GPS)
- Purpose: App functionality, Analytics
- Linked to user: Yes

#### 4. Screenshots
- Upload screenshots (see requirements above)
- Add captions to highlight features

#### 5. App Review Information
- Contact: Your email and phone
- Notes: "Test account credentials: admin@pulseofpeople.com / Admin@123456"
- Demo account: Provide test login credentials

#### 6. Version Information
- What's New: "Initial release of Pulse of People - Political Intelligence Platform"

### Step 6: Submit for Review

1. Click "Add for Review"
2. Answer export compliance questions (usually "No" for most apps)
3. Click "Submit to App Review"

### Step 7: Wait for Review

- **Timeline**: Usually 24-48 hours
- **Status**: Check in App Store Connect
- **If Rejected**: Review feedback and resubmit

## Common Rejection Reasons & Solutions

### 1. Missing Privacy Policy
**Solution**: Add privacy policy URL in app.config.js and App Store Connect

### 2. App Crashes During Review
**Solution**: Ensure app works without backend errors, add error handling

### 3. Incomplete Information
**Solution**: Fill all required fields in App Store Connect

### 4. Test Account Issues
**Solution**: Provide working test credentials in review notes

## Production Checklist

Before building for production:

- [ ] Remove all development/test API keys from code
- [ ] Update version number
- [ ] Test app thoroughly on physical device
- [ ] Ensure all permissions are properly described
- [ ] Remove console.log statements
- [ ] Test offline behavior
- [ ] Verify all screens load correctly
- [ ] Test signup and login flows
- [ ] Check analytics tracking
- [ ] Verify push notifications work (if implemented)

## Post-Launch

After approval:
1. App appears in App Store within 24 hours
2. Monitor crash reports in App Store Connect
3. Respond to user reviews
4. Track downloads and analytics

## Useful Commands

```bash
# Check EAS login
eas whoami

# Build for production
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --latest

# Check build status
eas build:list

# Update app version
# Edit app.config.js, then rebuild
```

## Support & Resources

- **Expo Documentation**: https://docs.expo.dev/distribution/introduction/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **EAS Submit**: https://docs.expo.dev/submit/introduction/
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/

## Troubleshooting

### Build Fails
- Check `eas build:list` for error logs
- Verify all dependencies are compatible
- Check iOS minimum version compatibility

### Submit Fails
- Verify Apple Developer account is active
- Check Bundle ID matches in both Expo and App Store Connect
- Ensure certificates are valid

### App Rejected
- Read rejection reason carefully
- Fix issues mentioned
- Respond to reviewer if clarification needed
- Resubmit with changes

---

**Last Updated**: 2025-11-02
**Version**: 1.0
**Next Review Date**: Before submitting updates
