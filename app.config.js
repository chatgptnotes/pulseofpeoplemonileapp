export default {
  expo: {
    name: "Pulse of People",
    slug: "simple-conversational-ai-rn",
    owner: "drmurali",
    scheme: "pulseofpeople",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    platforms: ["ios", "android"],
    icon: "./assets/icon.png",
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.pulseofpeople.ipadapp",
      buildNumber: "1",
      bitcode: false,
      icon: "./assets/icon.png",
      infoPlist: {
        NSMicrophoneUsageDescription: "This app needs microphone access for field reports and voice notes.",
        NSSpeechRecognitionUsageDescription: "This app needs speech recognition for voice-to-text in reports.",
        NSCameraUsageDescription: "This app uses camera to capture photos for field reports and events.",
        NSLocationWhenInUseUsageDescription: "This app uses location to tag field reports and track campaign activities.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "This app uses location for real-time field worker tracking.",
        NSPhotoLibraryUsageDescription: "This app needs access to your photos to attach images to field reports.",
        NSLocalNetworkUsageDescription: "This app uses local network for real-time data synchronization.",
        RTCConfiguration: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" }
          ],
          iceCandidatePoolSize: 10
        },
        UIBackgroundModes: ["audio"]
      }
    },
    android: {
      package: "com.drmurali.pulseofpeople",
      versionCode: 1,
      icon: "./assets/icon.png",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#1E40AF"
      },
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.CAMERA",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.VIBRATE",
        "android.permission.WAKE_LOCK",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.INTERNET"
      ]
    },
    extra: {
      eas: {
        projectId: "ad7b470e-f6d8-4ed7-918c-436099f78eaa"
      },
      EXPO_PUBLIC_AGENT_ID: process.env.EXPO_PUBLIC_AGENT_ID,
      EXPO_PUBLIC_ELEVENLABS_API_KEY: process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY,
      EXPO_PUBLIC_GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
    plugins: [
      "@livekit/react-native-expo-plugin",
      [
        "@config-plugins/react-native-webrtc",
        {
          cameraPermission: "Allow access to camera for video calls.",
          microphonePermission: "Allow access to microphone for voice conversations."
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            minSdkVersion: 24,
            targetSdkVersion: 35,
            compileSdkVersion: 35
          }
        }
      ]
    ]
  }
};