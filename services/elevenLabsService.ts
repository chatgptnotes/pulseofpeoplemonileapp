/**
 * ElevenLabs Voice Conversation Service
 * Handles real-time voice conversations with Tamil agent using official SDK
 *
 * NOTE: This is legacy code. Use the useConversation hook from @elevenlabs/react-native directly instead.
 * See components/VoiceAssistant.tsx for the correct implementation.
 */

import { Audio } from 'expo-av';

interface ConversationConfig {
  agentId: string;
  onMessage?: (message: string) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: string) => void;
}

export class ElevenLabsConversation {
  private config: ConversationConfig;
  private isActive = false;

  constructor(config: ConversationConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    throw new Error('This service is deprecated. Use the useConversation hook from @elevenlabs/react-native instead.');
  }

  async stop(): Promise<void> {
    this.isActive = false;
    this.config.onStatusChange?.('Stopped');
  }

  isConnected(): boolean {
    return this.isActive;
  }
}

// Helper function to create a conversation
// NOTE: Deprecated - use useConversation hook instead
export function createConversation(config: ConversationConfig): ElevenLabsConversation {
  return new ElevenLabsConversation(config);
}
