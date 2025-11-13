import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  gradient?: boolean;
  gradientColors?: string[];
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor = '#6B7280',
  trend,
  trendValue,
  gradient = false,
  gradientColors = ['#FFFFFF', '#FFFFFF'],
  style,
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'trending-up';
    if (trend === 'down') return 'trending-down';
    return 'trending-flat';
  };

  const getTrendColor = () => {
    if (trend === 'up') return '#10B981';
    if (trend === 'down') return '#EF4444';
    return '#6B7280';
  };

  const content = (
    <>
      <View style={styles.header}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
            <MaterialIcons name={icon} size={24} color={iconColor} />
          </View>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {trend && trendValue && (
            <View style={styles.trendContainer}>
              <MaterialIcons name={getTrendIcon()} size={14} color={getTrendColor()} />
              <Text style={[styles.trendText, { color: getTrendColor() }]}>{trendValue}</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={gradientColors}
        style={[styles.card, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {content}
      </LinearGradient>
    );
  }

  return <View style={[styles.card, style]}>{content}</View>;
};

const styles = StyleSheet.create({
  card: {
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
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
