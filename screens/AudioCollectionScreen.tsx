import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

export default function AudioCollectionScreen({ navigation }: any) {
  const { user } = useAuth();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Form data
  const [voterName, setVoterName] = useState('');
  const [voterPhone, setVoterPhone] = useState('');
  const [voterAge, setVoterAge] = useState('');
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission');
      }
    })();

    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);

      // Update duration every second
      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      newRecording.setOnRecordingStatusUpdate((status) => {
        if (!status.isRecording) {
          clearInterval(interval);
        }
      });
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setIsRecording(false);
      setRecording(null);

      // Get location
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation(loc.coords);
        }
      } catch (err) {
        console.log('Location error:', err);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playRecording = async () => {
    if (!recordingUri) return;

    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      await newSound.playAsync();
    } catch (err) {
      console.error('Failed to play recording', err);
    }
  };

  const stopPlaying = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const handleSubmit = async () => {
    if (!recordingUri) {
      Alert.alert('Error', 'Please record audio first');
      return;
    }

    if (!voterName) {
      Alert.alert('Error', 'Please enter voter name');
      return;
    }

    setLoading(true);
    try {
      // Upload audio to Supabase Storage
      const fileExt = 'mp4';
      const fileName = `${Date.now()}_${user?.id}.${fileExt}`;
      const filePath = `voter-audio/${fileName}`;

      const response = await fetch(recordingUri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Create voter call record
      const { error: dbError } = await supabase
        .from('voter_calls')
        .insert({
          organization_id: user?.organization_id,
          voter_name: voterName,
          voter_phone: voterPhone || null,
          voter_age: voterAge ? parseInt(voterAge) : null,
          call_duration: duration,
          recording_url: publicUrl,
          language: 'ta', // Tamil
          transcription_status: 'pending',
          agent_id: user?.id,
          agent_name: user?.name || user?.email,
        });

      if (dbError) throw dbError;

      Alert.alert('Success', 'Audio uploaded successfully! Transcription will be processed.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Audio Collection</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recording Section */}
        <View style={styles.section}>
          <View style={styles.recordingContainer}>
            <View style={styles.durationContainer}>
              <MaterialIcons
                name={isRecording ? 'fiber-manual-record' : 'mic'}
                size={32}
                color={isRecording ? '#EF4444' : '#6B7280'}
              />
              <Text style={styles.durationText}>{formatDuration(duration)}</Text>
            </View>

            <View style={styles.controlsRow}>
              {!isRecording && !recordingUri && (
                <TouchableOpacity
                  style={[styles.recordButton, styles.recordButtonPrimary]}
                  onPress={startRecording}
                >
                  <MaterialIcons name="mic" size={32} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Start Recording</Text>
                </TouchableOpacity>
              )}

              {isRecording && (
                <TouchableOpacity
                  style={[styles.recordButton, styles.recordButtonDanger]}
                  onPress={stopRecording}
                >
                  <MaterialIcons name="stop" size={32} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Stop Recording</Text>
                </TouchableOpacity>
              )}

              {recordingUri && !isRecording && (
                <>
                  <TouchableOpacity
                    style={[styles.playButton, isPlaying && styles.playButtonActive]}
                    onPress={isPlaying ? stopPlaying : playRecording}
                  >
                    <MaterialIcons
                      name={isPlaying ? 'pause' : 'play-arrow'}
                      size={28}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      setRecordingUri(null);
                      setDuration(0);
                    }}
                  >
                    <MaterialIcons name="delete" size={28} color="#FFFFFF" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Voter Details */}
        {recordingUri && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Voter Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter voter name"
                value={voterName}
                onChangeText={setVoterName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                value={voterPhone}
                onChangeText={setVoterPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter age"
                value={voterAge}
                onChangeText={setVoterAge}
                keyboardType="number-pad"
              />
            </View>

            {location && (
              <View style={styles.locationInfo}>
                <MaterialIcons name="location-on" size={16} color="#10B981" />
                <Text style={styles.locationText}>
                  Location captured: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="cloud-upload" size={24} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Submit & Transcribe</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  recordingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  durationText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 12,
    fontFamily: 'monospace',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  recordButtonPrimary: {
    backgroundColor: '#EF4444',
  },
  recordButtonDanger: {
    backgroundColor: '#DC2626',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonActive: {
    backgroundColor: '#F59E0B',
  },
  deleteButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 12,
    color: '#059669',
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
