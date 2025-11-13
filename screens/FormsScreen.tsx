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
import * as Location from 'expo-location';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

const ISSUE_CATEGORIES = [
  'Employment',
  'Healthcare',
  'Education',
  'Infrastructure',
  'Corruption',
  'Agriculture',
  'Law & Order',
  'Prices/Inflation',
];

export default function FormsScreen({ navigation }: any) {
  const { user } = useAuth();
  const [voterName, setVoterName] = useState('');
  const [voterPhone, setVoterPhone] = useState('');
  const [voterAge, setVoterAge] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [expectations, setExpectations] = useState('');
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const getLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      Alert.alert('Success', 'Location captured');
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get location');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!voterName || !message) {
      Alert.alert('Error', 'Please fill in name and message');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('direct_feedback')
        .insert({
          citizen_name: voterName,
          citizen_age: voterAge ? parseInt(voterAge) : null,
          citizen_phone: voterPhone || null,
          message_text: message,
          expectations: expectations || null,
          issue_category_id: selectedCategory || null,
          status: 'pending',
          submitted_by: user?.id,
        });

      if (error) throw error;

      Alert.alert('Success', 'Feedback submitted successfully', [
        {
          text: 'OK',
          onPress: () => {
            setVoterName('');
            setVoterPhone('');
            setVoterAge('');
            setSelectedCategory('');
            setMessage('');
            setExpectations('');
            setLocation(null);
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
      <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forms & Messages</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Voter Details */}
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
        </View>

        {/* Issue Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Issue Category</Text>
          <View style={styles.categoryGrid}>
            {ISSUE_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonSelected
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback Message *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter detailed feedback message..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Expectations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expectations (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What do they expect from the government..."
            value={expectations}
            onChangeText={setExpectations}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getLocation}
            disabled={gettingLocation}
          >
            {gettingLocation ? (
              <ActivityIndicator color="#10B981" />
            ) : (
              <>
                <MaterialIcons name="my-location" size={20} color="#10B981" />
                <Text style={styles.locationButtonText}>
                  {location ? 'Update Location' : 'Capture Location'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          {location && (
            <View style={styles.locationInfo}>
              <MaterialIcons name="location-on" size={16} color="#10B981" />
              <Text style={styles.locationText}>
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </Text>
            </View>
          )}
        </View>

        {/* Submit */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="send" size={24} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
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
  textArea: {
    minHeight: 120,
    paddingTop: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  categoryText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#10B981',
    gap: 8,
  },
  locationButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#059669',
    marginLeft: 8,
    fontFamily: 'monospace',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
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
