import React, { useState } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

interface PollOption {
  id: string;
  text: string;
}

const DEFAULT_POLLS = [
  {
    id: 'voting_intention',
    question: 'Which party will you vote for?',
    options: [
      { id: '1', text: 'TVK' },
      { id: '2', text: 'DMK' },
      { id: '3', text: 'AIADMK' },
      { id: '4', text: 'BJP' },
      { id: '5', text: 'Other' },
      { id: '6', text: 'Undecided' },
    ],
  },
  {
    id: 'satisfaction',
    question: 'How satisfied are you with the current government?',
    options: [
      { id: '1', text: 'Very Satisfied' },
      { id: '2', text: 'Satisfied' },
      { id: '3', text: 'Neutral' },
      { id: '4', text: 'Dissatisfied' },
      { id: '5', text: 'Very Dissatisfied' },
    ],
  },
  {
    id: 'key_issues',
    question: 'What is your main concern?',
    options: [
      { id: '1', text: 'Employment' },
      { id: '2', text: 'Healthcare' },
      { id: '3', text: 'Education' },
      { id: '4', text: 'Infrastructure' },
      { id: '5', text: 'Corruption' },
      { id: '6', text: 'Agriculture' },
    ],
  },
];

export default function PollsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [selectedPoll, setSelectedPoll] = useState(DEFAULT_POLLS[0]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [voterName, setVoterName] = useState('');
  const [voterPhone, setVoterPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedOption) {
      Alert.alert('Error', 'Please select an option');
      return;
    }

    if (!voterName) {
      Alert.alert('Error', 'Please enter voter name');
      return;
    }

    setLoading(true);
    try {
      const optionText = selectedPoll.options.find(o => o.id === selectedOption)?.text;

      const { error } = await supabase
        .from('poll_responses')
        .insert({
          poll_id: selectedPoll.id,
          question: selectedPoll.question,
          answer_type: 'single_choice',
          answer: optionText,
          voter_name: voterName,
          voter_phone: voterPhone || null,
          collected_by: user?.id,
          organization_id: user?.organization_id,
        });

      if (error) throw error;

      Alert.alert('Success', 'Poll response submitted successfully', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedOption(null);
            setVoterName('');
            setVoterPhone('');
          },
        },
      ]);
    } catch (error: any) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Polls & Surveys</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Poll Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Poll</Text>
          <View style={styles.pollTabs}>
            {DEFAULT_POLLS.map((poll, index) => (
              <TouchableOpacity
                key={poll.id}
                style={[
                  styles.pollTab,
                  selectedPoll.id === poll.id && styles.pollTabActive
                ]}
                onPress={() => {
                  setSelectedPoll(poll);
                  setSelectedOption(null);
                }}
              >
                <Text style={[
                  styles.pollTabText,
                  selectedPoll.id === poll.id && styles.pollTabTextActive
                ]}>
                  Poll {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Question */}
        <View style={styles.section}>
          <View style={styles.questionCard}>
            <MaterialIcons name="help-outline" size={24} color="#3B82F6" />
            <Text style={styles.questionText}>{selectedPoll.question}</Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Answer</Text>
          {selectedPoll.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedOption === option.id && styles.optionCardSelected
              ]}
              onPress={() => setSelectedOption(option.id)}
            >
              <View style={[
                styles.radio,
                selectedOption === option.id && styles.radioSelected
              ]}>
                {selectedOption === option.id && (
                  <View style={styles.radioDot} />
                )}
              </View>
              <Text style={[
                styles.optionText,
                selectedOption === option.id && styles.optionTextSelected
              ]}>
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Voter Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voter Information</Text>

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
            <Text style={styles.label}>Phone (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={voterPhone}
              onChangeText={setVoterPhone}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="check-circle" size={24} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submit Response</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  pollTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  pollTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  pollTabActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  pollTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  pollTabTextActive: {
    color: '#FFFFFF',
  },
  questionCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  questionText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    lineHeight: 26,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#3B82F6',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#1E40AF',
    fontWeight: '600',
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
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
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
