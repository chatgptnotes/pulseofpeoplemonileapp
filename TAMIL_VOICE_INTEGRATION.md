# Tamil Voice Assistant Integration Guide

## Overview

We've integrated a Tamil-speaking voice assistant using ElevenLabs with Meera's voice into the Pulse of People app.

## Configuration

### Voice Details
- **Voice**: Meera (Tamil)
- **Voice ID**: `gCr8TeSJgJaeaIoV4RWH`
- **Agent ID**: `agent_01k0epmyp1eenr1b0z4svccfrv`
- **Voice Library URL**: https://elevenlabs.io/app/voice-library?voiceId=gCr8TeSJgJaeaIoV4RWH

### Environment Variables

The following variables are configured in `.env`:

```env
# Tamil Voice Agent with Meera voice (gCr8TeSJgJaeaIoV4RWH)
EXPO_PUBLIC_AGENT_ID=agent_01k0epmyp1eenr1b0z4svccfrv
EXPO_PUBLIC_ELEVENLABS_API_KEY=sk_9c244c8231d6991f3b12319141016d60b7d120f36f1612dd
```

## UI Integration

### Location: Dashboard Screen

The voice assistant appears as a **floating microphone button** in the bottom-right corner of the Dashboard screen.

### Features:

1. **Floating Button**:
   - Blue circular button with microphone icon
   - Positioned at bottom-right: `{ bottom: 90, right: 20 }`
   - Pulse animation when listening
   - Always visible on the Dashboard

2. **Voice Modal**:
   - Opens when user taps the microphone button
   - Shows Tamil assistant interface
   - Displays:
     - "Tamil Voice Assistant" title
     - Microphone visualizer with pulse animation
     - Status text (e.g., "Listening in Tamil...")
     - Tamil hint text: "பேசத் தொடங்குங்கள் (Start speaking)"
     - Info box with usage instructions

3. **States**:
   - **Idle**: Blue microphone button
   - **Connecting**: Loading spinner in modal
   - **Listening**: Pulsing microphone with "Listening..." status
   - **Active**: Ready to receive Tamil voice input

## Files Modified/Created

### Created Files:
1. **`components/VoiceAssistant.tsx`**
   - React component for voice assistant UI
   - Handles microphone permissions
   - Manages audio session configuration
   - Shows modal with Tamil interface

### Modified Files:
1. **`.env`**
   - Updated `EXPO_PUBLIC_AGENT_ID` to Tamil agent
   - Added comment about Meera voice

2. **`screens/DashboardScreen.tsx`**
   - Imported `VoiceAssistant` component
   - Added component below ScrollView
   - Passes agent ID and API key from environment

## How It Works

### User Flow:

1. **User opens Dashboard**
   - Sees blue floating microphone button in bottom-right

2. **User taps microphone**
   - App requests microphone permission (if not granted)
   - Opens Tamil Voice Assistant modal
   - Status changes to "Connecting to Tamil assistant..."

3. **Connection established**
   - Microphone starts listening
   - Status shows "Listening in Tamil... 🎤"
   - Pulse animation indicates active listening

4. **User speaks in Tamil**
   - Meera (Tamil voice) processes the speech
   - Responds in Tamil voice
   - Conversation continues

5. **User closes assistant**
   - Taps close button or "Stop" icon
   - Modal closes
   - Returns to Dashboard

## Next Steps - Full ElevenLabs Integration

The current implementation has a **placeholder** for the actual ElevenLabs WebSocket connection. To complete the integration:

### Required: Install ElevenLabs SDK

```bash
npm install elevenlabs
# or
npm install @11labs/client
```

### Required: Implement WebSocket Connection

Replace the TODO comment in `VoiceAssistant.tsx` with:

```typescript
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({
  apiKey: apiKey,
});

// Start conversation with agent
const conversation = await client.conversationalAI.start({
  agentId: agentId,
  // Configure for Tamil language
  requiresAuth: false,
});

// Handle audio streaming
conversation.on("audio", (audioChunk) => {
  // Play audio response from Meera
});

conversation.on("message", (message) => {
  // Handle Tamil text transcription
});
```

### Optional: Add Features

1. **Conversation History**:
   - Store Tamil conversation in Supabase
   - Show transcript in modal

2. **Language Detection**:
   - Auto-detect if user speaks Tamil or English
   - Switch agents accordingly

3. **Voice Commands**:
   - "போ" (Go) - Navigate to screens
   - "உதவி" (Help) - Show help
   - "நிறுத்து" (Stop) - End conversation

## Testing

### To Test the UI:

1. Reload the app:
   ```bash
   npx expo start --clear
   ```

2. Navigate to Dashboard

3. You should see:
   - Blue microphone button in bottom-right
   - Tap it to open Tamil Assistant modal
   - See Tamil text: "பேசத் தொடங்குங்கள்"

### To Test Full Voice Integration:

1. Install ElevenLabs SDK (see above)
2. Implement WebSocket connection
3. Grant microphone permissions
4. Speak in Tamil
5. Hear Meera's Tamil response

## Deployment Notes

### For Development Build:
- Voice assistant works in development
- Test on physical iPhone for best audio quality

### For Production Build:
- Ensure `.env` variables are set in EAS
- Add to `eas.json`:
  ```json
  {
    "build": {
      "production": {
        "env": {
          "EXPO_PUBLIC_AGENT_ID": "agent_01k0epmyp1eenr1b0z4svccfrv",
          "EXPO_PUBLIC_ELEVENLABS_API_KEY": "your-key-here"
        }
      }
    }
  }
  ```

## Troubleshooting

### Issue: Button not visible
**Solution**: Check that Dashboard screen is rendered and ScrollView doesn't overlap

### Issue: Microphone permission denied
**Solution**: Go to Settings → App → Permissions → Enable Microphone

### Issue: No sound
**Solution**:
- Check device volume
- Verify audio session is configured
- Test with headphones

### Issue: Tamil not recognized
**Solution**:
- Verify agent ID is correct
- Check ElevenLabs dashboard for agent configuration
- Ensure Meera voice is selected in agent settings

## Support

- **ElevenLabs Documentation**: https://elevenlabs.io/docs
- **Voice Library**: https://elevenlabs.io/app/voice-library
- **Agent Dashboard**: https://elevenlabs.io/app/conversational-ai/agents

---

**Last Updated**: November 3, 2025
**Version**: 1.0
**Status**: UI Integrated, WebSocket Connection Pending
