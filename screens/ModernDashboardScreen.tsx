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
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { AnalyticsService, DashboardStats } from '../services/analytics';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { SkeletonCard, SkeletonLoader } from '../components/ui/SkeletonLoader';
import { ActivityFeedItem, ActivityItem } from '../components/feed/ActivityFeedItem';

const { width } = Dimensions.get('window');

export default function ModernDashboardScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const features = [
    {
      id: 'audio',
      title: 'Audio Collection',
      description: 'Record & transcribe',
      icon: 'mic',
      color: '#EF4444',
      screen: 'AudioCollection',
    },
    {
      id: 'polls',
      title: 'Polls & Surveys',
      description: 'Quick responses',
      icon: 'poll',
      color: '#3B82F6',
      screen: 'Polls',
    },
    {
      id: 'forms',
      title: 'Feedback Forms',
      description: 'Detailed messages',
      icon: 'description',
      color: '#10B981',
      screen: 'Forms',
    },
  ];

  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [statsData, activitiesData] = await Promise.all([
        AnalyticsService.getDashboardStats(user.id),
        AnalyticsService.getRecentActivities(user.id, 10),
      ]);

      setStats(statsData);
      setActivities(activitiesData as ActivityItem[]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, [loadDashboardData]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error('Logout error:', error);
      Alert.alert(
        'Logout Issue',
        'There was a problem signing out. Your local session will be cleared.',
        [{ text: 'OK' }]
      );
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Modern Header with Gradient */}
      <LinearGradient colors={['#1E40AF', '#3B82F6', '#60A5FA']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Avatar name={user?.name || user?.email || ''} size={48} showBadge badgeColor="#10B981" />
            <View style={styles.headerText}>
              <Text style={styles.greeting}>{getGreeting()}!</Text>
              <Text style={styles.userName}>{user?.name || user?.email}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats in Header */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{stats?.todayAudio || 0}</Text>
            <Text style={styles.quickStatLabel}>Audio</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{stats?.todayPolls || 0}</Text>
            <Text style={styles.quickStatLabel}>Polls</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{stats?.todayForms || 0}</Text>
            <Text style={styles.quickStatLabel}>Forms</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{stats?.totalCollected || 0}</Text>
            <Text style={styles.quickStatLabel}>Total</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Data Collection Tools */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Collection</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuresScrollContainer}
          >
            {features.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={styles.featureCard}
                onPress={() => navigation.navigate(feature.screen)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[feature.color, `${feature.color}CC`]}
                  style={styles.featureGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.featureIconContainer}>
                    <MaterialIcons name={feature.icon as any} size={32} color="#FFFFFF" />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                  <View style={styles.featureArrow}>
                    <MaterialIcons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Today's Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Performance</Text>
          {loading ? (
            <View style={styles.statsGrid}>
              <SkeletonLoader width={(width - 56) / 2} height={120} />
              <SkeletonLoader width={(width - 56) / 2} height={120} />
            </View>
          ) : (
            <View style={styles.statsGrid}>
              <StatCard
                title="Total Collected"
                value={stats?.totalCollected || 0}
                subtitle="All responses today"
                icon="trending-up"
                iconColor="#10B981"
                trend="up"
                trendValue="+12%"
                style={styles.statCardSmall}
              />
              <StatCard
                title="Completion Rate"
                value="87%"
                subtitle="Above target"
                icon="done-all"
                iconColor="#3B82F6"
                trend="up"
                trendValue="+5%"
                style={styles.statCardSmall}
              />
            </View>
          )}
        </View>

        {/* Recent Activity Feed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : activities.length > 0 ? (
            activities.slice(0, 5).map((activity) => (
              <ActivityFeedItem key={activity.id} item={activity} />
            ))
          ) : (
            <Card style={styles.emptyState}>
              <MaterialIcons name="inbox" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>No activities yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start collecting data to see your activity feed
              </Text>
            </Card>
          )}
        </View>

        {/* Quick Tips */}
        <View style={styles.section}>
          <Card gradient gradientColors={['#F0F9FF', '#E0F2FE']}>
            <View style={styles.tipCard}>
              <MaterialIcons name="lightbulb" size={24} color="#3B82F6" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Pro Tip</Text>
                <Text style={styles.tipText}>
                  Use audio collection for detailed conversations and polls for quick surveys
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pulse of People v2.0</Text>
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
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  greeting: {
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#E0E7FF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  featuresScrollContainer: {
    paddingRight: 20,
  },
  featureCard: {
    width: 160,
    height: 180,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  featureGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  featureArrow: {
    alignSelf: 'flex-end',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCardSmall: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#3B82F6',
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
