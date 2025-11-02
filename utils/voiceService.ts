import * as Speech from 'expo-speech';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';

/**
 * Voice Service for Speech Recognition and Text-to-Speech
 */

// Speech Recognition (Speech-to-Text)
export const startVoiceRecognition = async (
  onResult: (text: string) => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    // Set up event listeners
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        onResult(e.value[0]);
      }
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      console.error('Speech recognition error:', e);
      onError(e.error?.message || 'Speech recognition failed');
    };

    // Start listening
    await Voice.start('en-US'); // You can change to 'hi-IN' for Hindi
    console.log('🎤 Voice recognition started');
  } catch (error) {
    console.error('Failed to start voice recognition:', error);
    onError(error instanceof Error ? error.message : 'Unknown error');
  }
};

export const stopVoiceRecognition = async (): Promise<void> => {
  try {
    await Voice.stop();
    await Voice.destroy();
    Voice.removeAllListeners();
    console.log('🎤 Voice recognition stopped');
  } catch (error) {
    console.error('Failed to stop voice recognition:', error);
  }
};

export const isVoiceRecognitionAvailable = async (): Promise<boolean> => {
  try {
    const available = await Voice.isAvailable();
    return Boolean(available);
  } catch (error) {
    console.error('Error checking voice availability:', error);
    return false;
  }
};

// Text-to-Speech (TTS)
export const speakText = async (
  text: string,
  options?: {
    language?: string;
    pitch?: number;
    rate?: number;
    onDone?: () => void;
    onError?: (error: string) => void;
  }
): Promise<void> => {
  try {
    // Stop any ongoing speech
    await Speech.stop();

    // Speak the text
    await Speech.speak(text, {
      language: options?.language || 'en-US', // Change to 'hi-IN' for Hindi
      pitch: options?.pitch || 1.0,
      rate: options?.rate || 1.0,
      onDone: options?.onDone,
      onError: (error) => {
        console.error('TTS error:', error);
        options?.onError?.(error.toString());
      },
    });

    console.log('🔊 Speaking:', text.substring(0, 50) + '...');
  } catch (error) {
    console.error('Failed to speak text:', error);
    options?.onError?.(error instanceof Error ? error.message : 'Unknown error');
  }
};

export const stopSpeaking = async (): Promise<void> => {
  try {
    await Speech.stop();
    console.log('🔊 Speech stopped');
  } catch (error) {
    console.error('Failed to stop speech:', error);
  }
};

export const isSpeaking = async (): Promise<boolean> => {
  try {
    return await Speech.isSpeakingAsync();
  } catch (error) {
    console.error('Error checking if speaking:', error);
    return false;
  }
};

// Utility: Get available voices
export const getAvailableVoices = async () => {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    console.log('Available voices:', voices.length);
    return voices;
  } catch (error) {
    console.error('Failed to get available voices:', error);
    return [];
  }
};
