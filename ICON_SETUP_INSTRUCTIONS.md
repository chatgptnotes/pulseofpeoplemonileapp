# 🎤 Microphone Icon Setup Instructions

## Step 1: Save the Microphone Image

1. Download the blue microphone icon image
2. Save it as: `icon.png`
3. Place it in the `assets/` folder: `/Users/apple/Music/Cherri_pic_voiceagent/assets/icon.png`

### Image Requirements:
- **Size**: 1024x1024 pixels (recommended)
- **Format**: PNG with transparency
- **Background**: Blue circle with white microphone

---

## Step 2: Update app.config.js

Add these lines to the expo config:

```javascript
export default {
  expo: {
    name: "Cherri Pic Voice Agent",
    slug: "cherripicvoiceagent",

    // Add icon path
    icon: "./assets/icon.png",

    // Add splash screen
    splash: {
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#2563EB"
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#2563EB"
      }
    },

    ios: {
      icon: "./assets/icon.png"
    }
  }
}
```

---

## Step 3: Rebuild the App

After adding the icon, you need to rebuild:

```bash
# Generate native code with new icon
npx expo prebuild --clean

# Build with EAS
eas build --profile development --platform android

# Or local build
npm run android
```

---

## Quick Setup Script

If you have the icon ready at `assets/icon.png`, I can update the config automatically.

Just confirm:
1. Icon file is at: `assets/icon.png`
2. Size is 1024x1024 or larger
3. Format is PNG

---

## Alternative: Use Existing agent_logo.png

If you want to use the existing `assets/agent_logo.png`:

```bash
# Copy it as icon
cp assets/agent_logo.png assets/icon.png
```

Then I'll update the config.

---

Let me know when the icon is ready!
