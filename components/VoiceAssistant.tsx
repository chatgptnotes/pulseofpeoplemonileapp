import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useConversation } from '@elevenlabs/react-native';
import { Audio } from 'expo-av';
import { fetchConversationToken } from '../services/elevenLabsTokenService';

interface VoiceAssistantProps {
  agentId: string;
}

interface Message {
  text: string;
  timestamp: Date;
}

export default function VoiceAssistant({ agentId }: VoiceAssistantProps) {
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Use ElevenLabs hook
  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      console.log('✅ Connected to ElevenLabs:', conversationId);
      addMessage('Connected to Meera! Speak in Tamil.');
    },
    onDisconnect: (details) => {
      console.log('❌ Disconnected:', details);
    },
    onError: (message) => {
      console.error('Conversation error:', message);
      Alert.alert('Error', message);
    },
    onMessage: ({ message, source }) => {
      if (message.type === 'user_transcript') {
        const text = message.user_transcription_event.user_transcript;
        console.log('🎤 User said:', text);
        addMessage(`You: ${text}`);
      } else if (message.type === 'agent_response') {
        const text = message.agent_response_event.agent_response;
        console.log('🤖 Agent said:', text);
        addMessage(`Meera: ${text}`);
      }
    },
    onStatusChange: ({ status }) => {
      console.log('Status changed:', status);
    },
  });

  const { status, isSpeaking } = conversation;
  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  // Pulse animation when connected
  useEffect(() => {
    if (isConnected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        conversation.endSession();
      }
    };
  }, []);

  const addMessage = (text: string) => {
    setMessages((prev) => [...prev, { text, timestamp: new Date() }]);
  };

  const startConversation = async () => {
    try {
      setShowModal(true);
      setMessages([]);

      console.log('Starting conversation with agent:', agentId);

      // Configure audio session for voice playback and recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeIOS: 1, // InterruptionModeIOS.DoNotMix
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1, // InterruptionModeAndroid.DoNotMix
        playThroughEarpieceAndroid: false,
      });

      console.log('Audio mode configured for voice conversation');

      // Try direct agent ID first (for public agents)
      try {
        console.log('Attempting direct agent ID connection...');
        await conversation.startSession({
          agentId: agentId,
        });
      } catch (directError) {
        console.log('Direct connection failed, trying signed token...', directError);

        // If direct connection fails, try with signed token (for private agents)
        const signedUrl = await fetchConversationToken(agentId);
        console.log('Got signed URL, starting session...');

        await conversation.startSession({
          conversationToken: signedUrl,
        });
      }

    } catch (error) {
      console.error('Error starting conversation:', error);
      Alert.alert(
        'Connection Error',
        error instanceof Error ? error.message : 'Failed to connect to voice assistant',
        [{ text: 'OK' }]
      );
      setShowModal(false);
    }
  };

  const stopConversation = async () => {
    try {
      await conversation.endSession();
      setShowModal(false);
      setMessages([]);
    } catch (error) {
      console.error('Error stopping conversation:', error);
    }
  };

  const getStatusText = () => {
    if (isConnecting) return 'Connecting to Tamil assistant...';
    if (isConnected && isSpeaking) return 'Meera is speaking...';
    if (isConnected) return 'பேசுங்கள் (Speak)...';
    return status === 'disconnected' ? 'Disconnected' : 'Ready';
  };

  return (
    <>
      {/* Floating Voice Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => (isConnected ? stopConversation() : startConversation())}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
          <MaterialIcons
            name={isConnected ? "stop" : "mic"}
            size={32}
            color="#FFFFFF"
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Voice Assistant Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={stopConversation}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tamil Voice Assistant</Text>
              <TouchableOpacity onPress={stopConversation}>
                <MaterialIcons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Voice Visualizer */}
            <View style={styles.visualizerContainer}>
              {isConnecting ? (
                <ActivityIndicator size="large" color="#3B82F6" />
              ) : (
                <Animated.View style={[styles.microphone, { transform: [{ scale: pulseAnim }] }]}>
                  <MaterialIcons name="mic" size={64} color="#3B82F6" />
                </Animated.View>
              )}
            </View>

            {/* Status Text */}
            <Text style={styles.statusText}>{getStatusText()}</Text>

            {/* Tamil Hint */}
            <Text style={styles.hintText}>
              பேசத் தொடங்குங்கள் (Start speaking)
            </Text>

            {/* Conversation Messages */}
            {messages.length > 0 && (
              <ScrollView style={styles.messagesContainer}>
                {messages.map((msg, index) => (
                  <View key={index} style={styles.messageRow}>
                    <Text style={styles.messageText}>{msg.text}</Text>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Info */}
            {isConnected && (
              <View style={styles.infoBox}>
                <MaterialIcons name="info-outline" size={16} color="#6B7280" />
                <Text style={styles.infoText}>
                  Speak naturally in Tamil. Meera will respond in voice.
                </Text>
              </View>
            )}

            {/* Action Button */}
            {isConnected && !isConnecting && (
              <TouchableOpacity
                style={styles.stopButton}
                onPress={stopConversation}
              >
                <MaterialIcons name="stop" size={24} color="#FFFFFF" />
                <Text style={styles.stopButtonText}>Stop Conversation</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  visualizerContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  microphone: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
  },
  hintText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  messagesContainer: {
    width: '100%',
    maxHeight: 200,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  messageRow: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 13,
    color: '#374151',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
