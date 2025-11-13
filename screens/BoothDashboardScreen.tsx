import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { ExitPollCounter } from '../components/booth/ExitPollCounter';
import { VoterTurnoutTracker } from '../components/booth/VoterTurnoutTracker';
import { QuickNotes } from '../components/booth/QuickNotes';

const { width } = Dimensions.get('window');

export default function BoothDashboardScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [exitPollCounts, setExitPollCounts] = useState<Record<string, number>>({});
  const [turnoutData, setTurnoutData] = useState({
    totalVoters: 1250,
    votedCount: 847,
  });

  const boothInfo = {
    number: '127',
    ward: 'Ward 15',
    location: 'Government Higher Secondary School',
    assembly: 'Chennai Central',
  };

  const features = [
    {
      id: 'audio',
      title: 'Audio Collection',
      description: 'Record conversations',
      icon: 'mic',
      color: '#EF4444',
      screen: 'AudioCollection',
    },
    {
      id: 'polls',
      title: 'Quick Poll',
      description: 'Survey voters',
      icon: 'poll',
      color: '#3B82F6',
      screen: 'Polls',
    },
    {
      id: 'forms',
      title: 'Feedback',
      description: 'Detailed forms',
      icon: 'description',
      color: '#10B981',
      screen: 'Forms',
    },
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error: any) {
      Alert.alert(
        'Logout Issue',
        'There was a problem signing out. Your local session will be cleared.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleExitPollUpdate = (partyId: string, count: number) => {
    setExitPollCounts({ ...exitPollCounts, [partyId]: count });
    // TODO: Save to Supabase
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Sophisticated Dark Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.boothBadge}>
              <Text style={styles.boothNumber}>{boothInfo.number}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.boothTitle}>Booth {boothInfo.number}</Text>
              <Text style={styles.boothSubtitle}>{boothInfo.ward}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.timeBadge}>
              <MaterialIcons name="access-time" size={14} color="#A5B4FC" />
              <Text style={styles.timeText}>{getCurrentTime()}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <MaterialIcons name="logout" size={20} color="#E0E7FF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.locationInfo}>
          <MaterialIcons name="location-on" size={16} color="#818CF8" />
          <Text style={styles.locationText} numberOfLines={1}>
            {boothInfo.location}
          </Text>
        </View>

        <View style={styles.agentInfo}>
          <View style={styles.agentBadge}>
            <MaterialIcons name="person" size={16} color="#6366F1" />
          </View>
          <Text style={styles.agentName}>{user?.name || user?.email}</Text>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Exit Poll Counter */}
        <View style={styles.section}>
          <ExitPollCounter
            onCountUpdate={handleExitPollUpdate}
            initialCounts={exitPollCounts}
          />
        </View>

        {/* Voter Turnout */}
        <View style={styles.section}>
          <VoterTurnoutTracker
            totalVoters={turnoutData.totalVoters}
            votedCount={turnoutData.votedCount}
            onQuickAdd={() => {
              setTurnoutData({
                ...turnoutData,
                votedCount: turnoutData.votedCount + 1,
              });
            }}
          />
        </View>

        {/* Data Collection Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Collection</Text>
          <View style={styles.toolsGrid}>
            {features.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[styles.toolCard, { borderLeftColor: feature.color }]}
                onPress={() => navigation.navigate(feature.screen)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.toolIconContainer,
                    { backgroundColor: `${feature.color}15` },
                  ]}
                >
                  <MaterialIcons name={feature.icon as any} size={24} color={feature.color} />
                </View>
                <View style={styles.toolInfo}>
                  <Text style={styles.toolTitle}>{feature.title}</Text>
                  <Text style={styles.toolDescription}>{feature.description}</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Notes */}
        <View style={styles.section}>
          <QuickNotes />
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Activity</Text>
          <View style={styles.statsGrid}>
            <View style={styles.miniStatCard}>
              <MaterialIcons name="mic" size={20} color="#EF4444" />
              <Text style={styles.miniStatValue}>12</Text>
              <Text style={styles.miniStatLabel}>Audio</Text>
            </View>
            <View style={styles.miniStatCard}>
              <MaterialIcons name="poll" size={20} color="#3B82F6" />
              <Text style={styles.miniStatValue}>28</Text>
              <Text style={styles.miniStatLabel}>Polls</Text>
            </View>
            <View style={styles.miniStatCard}>
              <MaterialIcons name="description" size={20} color="#10B981" />
              <Text style={styles.miniStatValue}>15</Text>
              <Text style={styles.miniStatLabel}>Forms</Text>
            </View>
            <View style={styles.miniStatCard}>
              <MaterialIcons name="people" size={20} color="#6366F1" />
              <Text style={styles.miniStatValue}>55</Text>
              <Text style={styles.miniStatLabel}>Total</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Booth Agent Dashboard v2.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#1E1B4B', // Dark purple
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boothBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  boothNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerInfo: {},
  boothTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  boothSubtitle: {
    fontSize: 13,
    color: '#A5B4FC',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(165, 180, 252, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A5B4FC',
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    color: '#C7D2FE',
    flex: 1,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  agentBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  agentName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  toolsGrid: {
    gap: 12,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toolIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  toolDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  miniStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  miniStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
