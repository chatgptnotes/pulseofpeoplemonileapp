import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase, SentimentData, Alert as AlertType } from '../services/supabase';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
  const { user, hasPermission } = useAuth();
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load sentiment summary
      const { data: sentiment } = await supabase
        .from('sentiment_data')
        .select('sentiment_score, polarity, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (sentiment) {
        const positive = sentiment.filter(s => s.polarity === 'positive').length;
        const negative = sentiment.filter(s => s.polarity === 'negative').length;
        const neutral = sentiment.filter(s => s.polarity === 'neutral').length;
        const avgScore = sentiment.reduce((acc, s) => acc + (s.sentiment_score || 0), 0) / sentiment.length;

        setSentimentData({
          positive,
          negative,
          neutral,
          total: sentiment.length,
          avgScore: avgScore.toFixed(2),
        });
      }

      // Load recent alerts
      if (hasPermission('alerts.view')) {
        const { data: alertsData } = await supabase
          .from('alerts')
          .select('*')
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(5);

        if (alertsData) {
          setAlerts(alertsData);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return '#10B981';
    if (score < -0.3) return '#EF4444';
    return '#F59E0B';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back, {user?.name || 'User'}</Text>
        <Text style={styles.headerRole}>{user?.role.replace('_', ' ').toUpperCase() || 'USER'}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {sentimentData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sentiment Overview</Text>

            <View style={styles.sentimentCard}>
              <View style={styles.sentimentScore}>
                <Text style={styles.scoreLabel}>Overall Score</Text>
                <Text
                  style={[
                    styles.scoreValue,
                    { color: getSentimentColor(parseFloat(sentimentData.avgScore)) }
                  ]}
                >
                  {sentimentData.avgScore}
                </Text>
              </View>

              <View style={styles.sentimentBreakdown}>
                <View style={styles.sentimentItem}>
                  <View style={[styles.sentimentDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.sentimentLabel}>Positive</Text>
                  <Text style={styles.sentimentValue}>{sentimentData.positive}</Text>
                </View>
                <View style={styles.sentimentItem}>
                  <View style={[styles.sentimentDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.sentimentLabel}>Neutral</Text>
                  <Text style={styles.sentimentValue}>{sentimentData.neutral}</Text>
                </View>
                <View style={styles.sentimentItem}>
                  <View style={[styles.sentimentDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.sentimentLabel}>Negative</Text>
                  <Text style={styles.sentimentValue}>{sentimentData.negative}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {hasPermission('field_workers.submit_reports') && (
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('Submit')}
              >
                <MaterialIcons name="edit" size={40} color="#3B82F6" style={styles.actionIcon} />
                <Text style={styles.actionText}>Submit Report</Text>
              </TouchableOpacity>
            )}

            {hasPermission('data.view_analytics') && (
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('Analytics')}
              >
                <MaterialIcons name="bar-chart" size={40} color="#10B981" style={styles.actionIcon} />
                <Text style={styles.actionText}>Analytics</Text>
              </TouchableOpacity>
            )}

            {hasPermission('social_media.view') && (
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('SocialMedia')}
              >
                <MaterialIcons name="smartphone" size={40} color="#8B5CF6" style={styles.actionIcon} />
                <Text style={styles.actionText}>Social Media</Text>
              </TouchableOpacity>
            )}

            {hasPermission('data.surveys') && (
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('Surveys')}
              >
                <MaterialIcons name="assignment" size={40} color="#F59E0B" style={styles.actionIcon} />
                <Text style={styles.actionText}>Surveys</Text>
              </TouchableOpacity>
            )}

            {hasPermission('voters.view') && (
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('VoterDatabase')}
              >
                <MaterialIcons name="people" size={40} color="#EC4899" style={styles.actionIcon} />
                <Text style={styles.actionText}>Voters</Text>
              </TouchableOpacity>
            )}

            {hasPermission('ai_analytics.view_insights') && (
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('AIInsights')}
              >
                <MaterialIcons name="psychology" size={40} color="#06B6D4" style={styles.actionIcon} />
                <Text style={styles.actionText}>AI Insights</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Recent Alerts */}
        {alerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            {alerts.map((alert) => (
              <TouchableOpacity
                key={alert.id}
                style={styles.alertCard}
                onPress={() => navigation.navigate('Alerts')}
              >
                <View style={styles.alertHeader}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <View style={[
                    styles.severityBadge,
                    { backgroundColor: alert.severity === 'critical' ? '#EF4444' : alert.severity === 'warning' ? '#F59E0B' : '#3B82F6' }
                  ]}>
                    <Text style={styles.severityText}>{alert.severity}</Text>
                  </View>
                </View>
                <Text style={styles.alertMessage} numberOfLines={2}>
                  {alert.message}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.versionText}>v1.0.0 - {new Date().toLocaleDateString()}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
  },
  headerRole: {
    fontSize: 12,
    color: '#BFDBFE',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  sentimentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sentimentScore: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  sentimentBreakdown: {
    gap: 12,
  },
  sentimentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentimentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  sentimentLabel: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  sentimentValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  alertMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
