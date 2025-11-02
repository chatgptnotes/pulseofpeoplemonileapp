# iOS Production Build Instructions

Since the EAS build requires interactive Apple Developer account setup, please follow these steps in your terminal:

## Step 1: Run the Build Command

Open your terminal and navigate to the project directory, then run:

```bash
cd /Users/apple/Music/Cherri_pic_voiceagent
eas build --platform ios --profile production
```

## Step 2: Answer the Prompts

The command will ask you several questions. Here's how to answer:

### Apple Developer Account
```
? What would you like to use your Apple account for?
→ Select: App Store distribution

? Apple ID:
→ Enter: instaaid@emergencyseva.ai

? Password:
→ Enter: Iceland@1
```

### App-Specific Password
If it asks for an app-specific password:
1. Go to: https://appleid.apple.com/account/manage
2. Sign in with your Apple ID
3. In the "Security" section, click "Generate Password..." under "App-Specific Passwords"
4. Label it "EAS Build"
5. Copy the generated password
6. Paste it when prompted

### Team Selection
```
? Select an Apple Developer team:
→ Choose your team (should appear after login)
```

### Distribution Certificate
```
? Would you like to create a new Distribution Certificate?
→ Select: Yes
```

### Provisioning Profile
```
? Would you like to create a new Provisioning Profile?
→ Select: Yes
```

## Step 3: Wait for Build

After answering the prompts:
1. EAS will upload your code to the cloud
2. The build will start automatically
3. You'll see a URL to track the build progress
4. The build takes 15-30 minutes

## Step 4: Download the .ipa File

Once the build completes:
1. The .ipa file will be available at the build URL
2. Or run: `eas build:list` to see your builds
3. Download the .ipa file for submission

## Alternative: Manual Credential Setup

If you prefer to set up credentials first:

```bash
# Set up credentials
eas credentials

# Then build
eas build --platform ios --profile production
```

## Troubleshooting

### "Apple ID or password is incorrect"
- Verify your Apple ID credentials
- Make sure you're using an app-specific password if 2FA is enabled

### "No development team found"
- Verify your Apple Developer account is active ($99/year)
- Log into https://developer.apple.com/ to confirm

### "Bundle identifier is not available"
- The bundle ID com.pulseofpeople.voter must be registered
- Go to https://developer.apple.com/account/resources/identifiers
- Register the bundle ID if needed

## Next Steps

After the build succeeds:
1. Download the .ipa file
2. Submit to App Store using: `eas submit --platform ios --latest`
3. Or upload manually via Transporter app

---

**Note:** The build is running on EAS servers, so you can close the terminal and check progress later at: https://expo.dev/accounts/drmurali/projects/simple-conversational-ai-rn/builds
