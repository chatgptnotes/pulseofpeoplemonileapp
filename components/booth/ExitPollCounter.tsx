import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TAMIL_NADU_PARTIES, Party } from '../../constants/parties';
import * as Haptics from 'expo-haptics';

interface ExitPollCounterProps {
  onCountUpdate?: (partyId: string, count: number) => void;
  initialCounts?: Record<string, number>;
}

export const ExitPollCounter: React.FC<ExitPollCounterProps> = ({
  onCountUpdate,
  initialCounts = {},
}) => {
  const [counts, setCounts] = useState<Record<string, number>>(
    TAMIL_NADU_PARTIES.reduce(
      (acc, party) => ({ ...acc, [party.id]: initialCounts[party.id] || 0 }),
      {}
    )
  );

  const handleIncrement = async (party: Party) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newCount = counts[party.id] + 1;
    setCounts({ ...counts, [party.id]: newCount });
    onCountUpdate?.(party.id, newCount);
  };

  const handleDecrement = async (party: Party) => {
    if (counts[party.id] > 0) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newCount = counts[party.id] - 1;
      setCounts({ ...counts, [party.id]: newCount });
      onCountUpdate?.(party.id, newCount);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Exit Poll',
      'Are you sure you want to reset all counts?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const resetCounts = TAMIL_NADU_PARTIES.reduce(
              (acc, party) => ({ ...acc, [party.id]: 0 }),
              {}
            );
            setCounts(resetCounts);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const totalVotes = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Exit Poll Counter</Text>
          <Text style={styles.subtitle}>Tap party to record vote</Text>
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{totalVotes}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.partiesContainer}
      >
        {TAMIL_NADU_PARTIES.map((party) => (
          <TouchableOpacity
            key={party.id}
            style={[styles.partyCard, { borderColor: party.color }]}
            onPress={() => handleIncrement(party)}
            onLongPress={() => handleDecrement(party)}
            activeOpacity={0.7}
          >
            <View style={[styles.partyHeader, { backgroundColor: `${party.color}15` }]}>
              <Text style={styles.partySymbol}>{party.symbol}</Text>
            </View>

            <View style={styles.partyInfo}>
              <Text style={[styles.partyShortName, { color: party.color }]}>
                {party.shortName}
              </Text>
              {party.leader && (
                <Text style={styles.partyLeader} numberOfLines={1}>
                  {party.leader}
                </Text>
              )}
            </View>

            <View style={[styles.countBadge, { backgroundColor: party.color }]}>
              <Text style={styles.countText}>{counts[party.id]}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.decrementButton]}
                onPress={() => handleDecrement(party)}
                disabled={counts[party.id] === 0}
              >
                <MaterialIcons
                  name="remove"
                  size={16}
                  color={counts[party.id] === 0 ? '#D1D5DB' : '#6B7280'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: `${party.color}20` }]}
                onPress={() => handleIncrement(party)}
              >
                <MaterialIcons name="add" size={16} color={party.color} />
              </TouchableOpacity>
            </View>

            {totalVotes > 0 && (
              <View style={styles.percentage}>
                <Text style={styles.percentageText}>
                  {((counts[party.id] / totalVotes) * 100).toFixed(1)}%
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <MaterialIcons name="refresh" size={18} color="#EF4444" />
        <Text style={styles.resetText}>Reset All</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  totalBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  partiesContainer: {
    paddingRight: 16,
  },
  partyCard: {
    width: 140,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  partyHeader: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partySymbol: {
    fontSize: 48,
  },
  partyInfo: {
    padding: 12,
    paddingTop: 8,
    alignItems: 'center',
  },
  partyShortName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  partyLeader: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  countBadge: {
    marginHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  countText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  decrementButton: {
    backgroundColor: '#F9FAFB',
  },
  percentage: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  percentageText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    gap: 8,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
});
