import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  gradientColors?: string[];
  onPress?: () => void;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  gradient = false,
  gradientColors = ['#FFFFFF', '#FFFFFF'],
  onPress,
  elevated = true,
}) => {
  const containerStyle = [
    styles.card,
    elevated && styles.elevated,
    style,
  ];

  if (onPress) {
    if (gradient) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <LinearGradient colors={gradientColors} style={containerStyle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            {children}
          </LinearGradient>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={containerStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  if (gradient) {
    return (
      <LinearGradient colors={gradientColors} style={containerStyle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {children}
      </LinearGradient>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
});
