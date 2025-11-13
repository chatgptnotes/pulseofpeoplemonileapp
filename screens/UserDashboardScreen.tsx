import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function UserDashboardScreen({ navigation }: any) {
  const { user, signOut } = useAuth();

  const features = [
    {
      id: 'audio',
      title: 'Audio Collection',
      description: 'Record, transcribe & translate voter conversations',
      icon: 'mic',
      color: '#EF4444',
      screen: 'AudioCollection',
    },
    {
      id: 'polls',
      title: 'Polls & Surveys',
      description: 'Conduct polls with multiple choice questions',
      icon: 'poll',
      color: '#3B82F6',
      screen: 'Polls',
    },
    {
      id: 'forms',
      title: 'Forms & Messages',
      description: 'Collect written feedback and messages',
      icon: 'description',
      color: '#10B981',
      screen: 'Forms',
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error('Logout error:', error);
      // Show user-friendly error
      Alert.alert(
        'Logout Issue',
        'There was a problem signing out. Your local session will be cleared.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.userName}>{user?.name || user?.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>Field Worker</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Collection Tools</Text>
          <Text style={styles.sectionSubtitle}>
            Choose a tool to start collecting voter data
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              onPress={() => navigation.navigate(feature.screen)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[feature.color, `${feature.color}DD`]}
                style={styles.featureGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.featureIconContainer}>
                  <MaterialIcons
                    name={feature.icon as any}
                    size={40}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
                <MaterialIcons
                  name="arrow-forward"
                  size={24}
                  color="rgba(255,255,255,0.8)"
                />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Today's Activity</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialIcons name="mic" size={24} color="#EF4444" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Audio Recorded</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="poll" size={24} color="#3B82F6" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Polls Conducted</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="description" size={24} color="#10B981" />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Forms Submitted</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pulse of People - Field Worker App</Text>
          <Text style={styles.versionText}>v1.0.0</Text>
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
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: '#E0E7FF',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  featuresContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featureCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  featureGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  statsSection: {
    padding: 20,
    marginTop: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 10,
    color: '#D1D5DB',
  },
});
