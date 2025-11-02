# 🎤 Voice Features Rebuild Instructions

Voice input/output features are now enabled in the code, but you need to **rebuild the app** to include the native modules.

## Why Rebuild is Required?

The following packages are **native modules** and cannot be loaded at runtime:
- `expo-speech` - Text-to-Speech (voice output)
- `@react-native-voice/voice` - Speech Recognition (voice input)

These need to be compiled into the native app binary.

---

## 🚀 Option 1: EAS Build (Recommended - Easiest)

### Step 1: Login to EAS
```bash
eas login
```

### Step 2: Build Development Client for Android
```bash
eas build --profile development --platform android
```

**Wait 5-10 minutes** for the build to complete on EAS servers.

### Step 3: Download & Install
- EAS will provide a download link
- Download the APK on your Android device
- Install the new development build
- Uninstall old app first if needed

### Step 4: Start Metro
```bash
npm start
```

### Step 5: Scan QR code with new development build

---

## 🔧 Option 2: Local Build (Faster if Android Studio is setup)

### Prerequisites:
- Android Studio installed
- Android SDK configured
- Java JDK 17+ installed

### Step 1: Generate Native Code
```bash
npx expo prebuild --clean
```

### Step 2: Build and Install
```bash
npm run android
```

This will build and install the app on your connected device/emulator.

---

## 📱 After Rebuild - How to Use Voice Features

### 1. Voice Gemini AI Card
- Tap **"🗣️ Voice Gemini AI"** card
- Icon changes to 🎤 (Listening...)
- **Speak your question** clearly
- Wait for processing (⏳)
- Gemini responds with **voice** (🔊)

### 2. Bottom Voice Button
- Tap the **🗣️ button** in bottom input bar
- Speak your question
- Gemini responds with voice

### 3. Text Input (Still Available)
- Type question in input field
- Tap 🤖 button
- Read text response (no voice)

---

## ✅ Voice Features Included:

✅ **Speech-to-Text** (Voice Input)
- Recognizes English speech
- Can be changed to Hindi ('hi-IN')
- Real-time recognition

✅ **Text-to-Speech** (Voice Output)
- Natural voice responses
- Adjustable rate and pitch
- English by default

✅ **Status Indicators**
- 🎤 Listening - Recording your speech
- ⏳ Processing - Sending to Gemini
- 🔊 Speaking - Playing Gemini's voice response

✅ **Stop Controls**
- Tap again to stop listening
- Tap again to stop speaking

---

## 🌐 Language Configuration

To change language to Hindi, edit **App.tsx line 380**:

```typescript
// For Hindi
language: 'hi-IN'

// For English (current)
language: 'en-US'
```

---

## ⚠️ Important Notes:

1. **Microphone Permission**: App will request microphone access on first use
2. **Speech Recognition Permission** (iOS): Will request on first use
3. **Internet Required**: Gemini API needs internet connection
4. **Clear Speech**: Speak clearly for best recognition
5. **Quiet Environment**: Minimize background noise

---

## 🐛 Troubleshooting:

### Voice recognition not working?
- Check microphone permissions in Settings
- Try speaking louder and clearer
- Check internet connection

### Voice output not playing?
- Check device volume
- Unmute device
- Try headphones

### Still getting "Cannot find native module" error?
- You need to rebuild the app (see options above)
- Refresh is not enough for native modules

---

## 📝 Quick Command Reference:

```bash
# EAS Build (Cloud)
eas login
eas build --profile development --platform android

# Local Build
npx expo prebuild --clean
npm run android

# Start Metro (after build)
npm start
```

---

## 🎯 Expected Behavior After Rebuild:

1. **"🗣️ Voice Gemini AI"** card works
2. **🗣️ button** in bottom bar works
3. No "Cannot find native module" errors
4. Microphone permission is requested
5. Voice input → Gemini → Voice output works

---

Good luck with the rebuild! 🚀
