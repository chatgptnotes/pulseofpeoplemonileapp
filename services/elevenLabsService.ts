/**
 * ElevenLabs Voice Conversation Service
 * Handles real-time voice conversations with Tamil agent
 */

import { Audio } from 'expo-av';

interface ConversationConfig {
  agentId: string;
  apiKey: string;
  onMessage?: (message: string) => void;
  onAudioReceived?: (audioData: ArrayBuffer) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: string) => void;
}

interface AudioChunk {
  audio: string; // base64 encoded audio
  isFinal: boolean;
}

export class ElevenLabsConversation {
  private ws: WebSocket | null = null;
  private config: ConversationConfig;
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;
  private isActive = false;
  private audioQueue: ArrayBuffer[] = [];
  private isPlaying = false;

  constructor(config: ConversationConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    try {
      this.config.onStatusChange?.('Connecting...');

      // Configure audio mode for conversation
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Start WebSocket connection to ElevenLabs
      const wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${this.config.agentId}`;

      this.ws = new WebSocket(wsUrl);

      // Set up WebSocket event handlers
      this.ws.onopen = () => {
        console.log('✅ Connected to ElevenLabs');
        this.config.onStatusChange?.('Connected');
        this.isActive = true;

        // Send authentication
        this.ws?.send(JSON.stringify({
          type: 'auth',
          api_key: this.config.apiKey,
        }));

        // Start recording after connection
        this.startRecording();
      };

      this.ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          await this.handleMessage(data);
        } catch (error) {
          console.error('Error handling message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.config.onError?.('Connection error');
      };

      this.ws.onclose = () => {
        console.log('❌ Disconnected from ElevenLabs');
        this.config.onStatusChange?.('Disconnected');
        this.isActive = false;
        this.stopRecording();
      };

    } catch (error) {
      console.error('Failed to start conversation:', error);
      this.config.onError?.(error instanceof Error ? error.message : 'Failed to start');
      throw error;
    }
  }

  private async handleMessage(data: any): Promise<void> {
    switch (data.type) {
      case 'audio':
        // Received audio response from agent
        if (data.audio) {
          await this.playAudio(data.audio);
        }
        break;

      case 'transcript':
        // User's speech transcription
        if (data.role === 'user' && data.text) {
          console.log('🎤 User said:', data.text);
          this.config.onMessage?.(`You: ${data.text}`);
        }
        // Agent's response text
        else if (data.role === 'assistant' && data.text) {
          console.log('🤖 Agent said:', data.text);
          this.config.onMessage?.(`Meera: ${data.text}`);
        }
        break;

      case 'interruption':
        // User interrupted, stop current playback
        await this.stopAudioPlayback();
        break;

      case 'ping':
        // Send pong to keep connection alive
        this.ws?.send(JSON.stringify({ type: 'pong' }));
        break;

      case 'error':
        console.error('Agent error:', data.message);
        this.config.onError?.(data.message);
        break;
    }
  }

  private async startRecording(): Promise<void> {
    try {
      this.config.onStatusChange?.('Listening...');

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });

      await recording.startAsync();
      this.recording = recording;

      // Stream audio chunks to WebSocket
      recording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording && status.durationMillis % 500 === 0) {
          // Send audio chunk every 500ms
          this.sendAudioChunk();
        }
      });

      console.log('🎤 Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      this.config.onError?.('Microphone error');
    }
  }

  private async sendAudioChunk(): Promise<void> {
    try {
      if (!this.recording || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return;
      }

      // Get current recording data
      const uri = this.recording.getURI();
      if (!uri) return;

      // In production, you'd read the audio file and send chunks
      // For now, this is a placeholder for the audio streaming logic
      // You would typically use a library to read and encode audio chunks

    } catch (error) {
      console.error('Error sending audio chunk:', error);
    }
  }

  private async stopRecording(): Promise<void> {
    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        this.recording = null;
        console.log('🎤 Recording stopped');
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  }

  private async playAudio(base64Audio: string): Promise<void> {
    try {
      // Decode base64 audio
      const audioData = this.base64ToArrayBuffer(base64Audio);

      // Add to queue
      this.audioQueue.push(audioData);

      // Start playing if not already playing
      if (!this.isPlaying) {
        await this.playNextInQueue();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  private async playNextInQueue(): Promise<void> {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioData = this.audioQueue.shift();

    try {
      if (audioData) {
        // Create sound from audio data
        // Note: In production, you'd need to convert ArrayBuffer to a playable format
        // This is a simplified version

        const { sound } = await Audio.Sound.createAsync(
          { uri: this.arrayBufferToBase64Uri(audioData) },
          { shouldPlay: true }
        );

        this.sound = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            // Play next in queue
            this.playNextInQueue();
          }
        });
      }
    } catch (error) {
      console.error('Error in playback:', error);
      // Continue with next in queue
      this.playNextInQueue();
    }
  }

  private async stopAudioPlayback(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      }
      this.audioQueue = [];
      this.isPlaying = false;
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToBase64Uri(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return `data:audio/wav;base64,${btoa(binary)}`;
  }

  async stop(): Promise<void> {
    try {
      this.isActive = false;

      // Stop recording
      await this.stopRecording();

      // Stop audio playback
      await this.stopAudioPlayback();

      // Close WebSocket
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.config.onStatusChange?.('Stopped');
      console.log('🛑 Conversation stopped');
    } catch (error) {
      console.error('Error stopping conversation:', error);
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN && this.isActive;
  }
}

// Helper function to create a conversation
export function createConversation(config: ConversationConfig): ElevenLabsConversation {
  return new ElevenLabsConversation(config);
}
