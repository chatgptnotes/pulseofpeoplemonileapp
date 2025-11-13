import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface VoterTurnoutTrackerProps {
  totalVoters: number;
  votedCount: number;
  onQuickAdd?: () => void;
}

export const VoterTurnoutTracker: React.FC<VoterTurnoutTrackerProps> = ({
  totalVoters,
  votedCount,
  onQuickAdd,
}) => {
  const percentage = totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0;
  const remaining = totalVoters - votedCount;

  const getProgressColor = () => {
    if (percentage >= 70) return '#10B981'; // Green
    if (percentage >= 50) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="how-to-vote" size={24} color="#6366F1" />
          <View style={styles.headerText}>
            <Text style={styles.title}>Voter Turnout</Text>
            <Text style={styles.subtitle}>Real-time tracking</Text>
          </View>
        </View>
        {onQuickAdd && (
          <TouchableOpacity style={styles.quickAddButton} onPress={onQuickAdd}>
            <MaterialIcons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{votedCount}</Text>
          <Text style={styles.statLabel}>Voted</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: '#6B7280' }]}>{remaining}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalVoters}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={[styles.percentage, { color: getProgressColor() }]}>
            {percentage.toFixed(1)}%
          </Text>
          <Text style={styles.progressLabel}>Turnout</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
      </View>

      {percentage >= 70 && (
        <View style={styles.achievementBadge}>
          <MaterialIcons name="emoji-events" size={16} color="#F59E0B" />
          <Text style={styles.achievementText}>Excellent turnout! 🎉</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  quickAddButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressInfo: {
    alignItems: 'center',
  },
  percentage: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 2,
  },
  progressLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  progressBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  achievementText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D97706',
  },
});
