import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../contexts/AuthContext';
import { supabase, SocialPost } from '../services/supabase';

type Platform = 'all' | 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'whatsapp';

export default function SocialMediaScreen({ navigation }: any) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<SocialPost[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [selectedPlatform, posts]);

  const loadPosts = async () => {
    try {
      let query = supabase
        .from('social_posts')
        .select('*')
        .order('posted_at', { ascending: false })
        .limit(100);

      if (user?.tenant_id) {
        query = query.eq('tenant_id', user.tenant_id);
      }

      const { data, error } = await query;

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error('Error loading social posts:', error);
      Alert.alert('Error', 'Failed to load social media posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterPosts = () => {
    if (selectedPlatform === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.platform === selectedPlatform));
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return '𝕏';
      case 'facebook':
        return '📘';
      case 'instagram':
        return '📷';
      case 'youtube':
        return '📺';
      case 'whatsapp':
        return '💬';
      default:
        return '📱';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return '#1DA1F2';
      case 'facebook':
        return '#1877F2';
      case 'instagram':
        return '#E4405F';
      case 'youtube':
        return '#FF0000';
      case 'whatsapp':
        return '#25D366';
      default:
        return '#6B7280';
    }
  };

  const getSentimentColor = (score?: number) => {
    if (!score) return '#9CA3AF';
    if (score > 0.3) return '#10B981';
    if (score < -0.3) return '#EF4444';
    return '#F59E0B';
  };

  const getSentimentLabel = (score?: number) => {
    if (!score) return 'Unknown';
    if (score > 0.3) return 'Positive';
    if (score < -0.3) return 'Negative';
    return 'Neutral';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.header}>
        <Text style={styles.headerTitle}>Social Media</Text>
        <Text style={styles.headerSubtitle}>{filteredPosts.length} posts</Text>
      </LinearGradient>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['all', 'twitter', 'facebook', 'instagram', 'youtube', 'whatsapp'] as Platform[]).map(
            (platform) => (
              <TouchableOpacity
                key={platform}
                style={[
                  styles.filterButton,
                  selectedPlatform === platform && styles.filterButtonActive,
                  selectedPlatform === platform && {
                    backgroundColor: platform === 'all' ? '#1E40AF' : getPlatformColor(platform),
                  },
                ]}
                onPress={() => setSelectedPlatform(platform)}
              >
                <Text style={styles.filterIcon}>
                  {platform === 'all' ? '🌐' : getPlatformIcon(platform)}
                </Text>
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedPlatform === platform && styles.filterButtonTextActive,
                  ]}
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No posts found</Text>
            <Text style={styles.emptySubtext}>
              {selectedPlatform === 'all'
                ? 'No social media posts available'
                : `No posts from ${selectedPlatform}`}
            </Text>
          </View>
        ) : (
          <View style={styles.postsList}>
            {filteredPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.authorContainer}>
                    <View
                      style={[
                        styles.platformBadge,
                        { backgroundColor: getPlatformColor(post.platform) },
                      ]}
                    >
                      <Text style={styles.platformIcon}>{getPlatformIcon(post.platform)}</Text>
                    </View>
                    <View style={styles.authorInfo}>
                      <Text style={styles.authorName}>{post.author}</Text>
                      {post.author_handle && (
                        <Text style={styles.authorHandle}>@{post.author_handle}</Text>
                      )}
                    </View>
                  </View>
                  {post.is_influencer && (
                    <View style={styles.influencerBadge}>
                      <Text style={styles.influencerIcon}>⭐</Text>
                      <Text style={styles.influencerText}>Influencer</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.postContent}>{post.content}</Text>

                <View style={styles.postMeta}>
                  <View style={styles.engagement}>
                    {post.engagement_metrics.likes !== undefined && (
                      <View style={styles.engagementItem}>
                        <Text style={styles.engagementIcon}>❤️</Text>
                        <Text style={styles.engagementValue}>
                          {formatNumber(post.engagement_metrics.likes)}
                        </Text>
                      </View>
                    )}
                    {post.engagement_metrics.shares !== undefined && (
                      <View style={styles.engagementItem}>
                        <Text style={styles.engagementIcon}>🔄</Text>
                        <Text style={styles.engagementValue}>
                          {formatNumber(post.engagement_metrics.shares)}
                        </Text>
                      </View>
                    )}
                    {post.engagement_metrics.comments !== undefined && (
                      <View style={styles.engagementItem}>
                        <Text style={styles.engagementIcon}>💬</Text>
                        <Text style={styles.engagementValue}>
                          {formatNumber(post.engagement_metrics.comments)}
                        </Text>
                      </View>
                    )}
                    {post.engagement_metrics.views !== undefined && (
                      <View style={styles.engagementItem}>
                        <Text style={styles.engagementIcon}>👁️</Text>
                        <Text style={styles.engagementValue}>
                          {formatNumber(post.engagement_metrics.views)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.postFooter}>
                  <View
                    style={[
                      styles.sentimentBadge,
                      { backgroundColor: getSentimentColor(post.sentiment_score) },
                    ]}
                  >
                    <Text style={styles.sentimentText}>
                      {getSentimentLabel(post.sentiment_score)}
                    </Text>
                  </View>
                  <Text style={styles.postTime}>{formatDate(post.posted_at)}</Text>
                </View>
              </View>
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
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#1E40AF',
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  postsList: {
    padding: 20,
  },
  postCard: {
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  platformBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  platformIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  authorHandle: {
    fontSize: 13,
    color: '#6B7280',
  },
  influencerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  influencerIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  influencerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  postContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  postMeta: {
    marginBottom: 12,
  },
  engagement: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  engagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engagementIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  engagementValue: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sentimentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sentimentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  postTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
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
