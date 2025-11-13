import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar } from '../ui/Avatar';

export interface ActivityItem {
  id: string;
  type: 'audio' | 'poll' | 'form' | 'system';
  agentName: string;
  agentId: string;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  metadata?: {
    voterCount?: number;
    category?: string;
    duration?: string;
  };
}

interface ActivityFeedItemProps {
  item: ActivityItem;
  onPress?: () => void;
}

export const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({ item, onPress }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'audio':
        return { name: 'mic' as const, color: '#EF4444' };
      case 'poll':
        return { name: 'poll' as const, color: '#3B82F6' };
      case 'form':
        return { name: 'description' as const, color: '#10B981' };
      default:
        return { name: 'info' as const, color: '#6B7280' };
    }
  };

  const icon = getIcon();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.leftSection}>
        <Avatar name={item.agentName} size={48} showBadge />
        <View style={[styles.iconBadge, { backgroundColor: icon.color }]}>
          <MaterialIcons name={icon.name} size={14} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.agentName}>{item.agentName}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        {item.location && (
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={14} color="#6B7280" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        )}

        {item.metadata && (
          <View style={styles.metadataContainer}>
            {item.metadata.voterCount !== undefined && (
              <View style={styles.metadataItem}>
                <MaterialIcons name="people" size={14} color="#6B7280" />
                <Text style={styles.metadataText}>{item.metadata.voterCount} voters</Text>
              </View>
            )}
            {item.metadata.duration && (
              <View style={styles.metadataItem}>
                <MaterialIcons name="schedule" size={14} color="#6B7280" />
                <Text style={styles.metadataText}>{item.metadata.duration}</Text>
              </View>
            )}
            {item.metadata.category && (
              <View style={[styles.categoryBadge, { backgroundColor: `${icon.color}15` }]}>
                <Text style={[styles.categoryText, { color: icon.color }]}>
                  {item.metadata.category}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
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
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  leftSection: {
    marginRight: 12,
    position: 'relative',
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  agentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
