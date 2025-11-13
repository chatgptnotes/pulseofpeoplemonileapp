import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: number;
  showBadge?: boolean;
  badgeColor?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = 'User',
  imageUrl,
  size = 40,
  showBadge = false,
  badgeColor = '#10B981',
  style,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const gradientColors = getGradientFromName(name);

  return (
    <View style={[{ width: size, height: size }, style]}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <LinearGradient
          colors={gradientColors}
          style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
        </LinearGradient>
      )}
      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: badgeColor,
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: (size * 0.25) / 2,
              borderWidth: size * 0.05,
            },
          ]}
        />
      )}
    </View>
  );
};

function getGradientFromName(name: string): string[] {
  const gradients = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#30cfd0', '#330867'],
    ['#a8edea', '#fed6e3'],
    ['#ff9a9e', '#fecfef'],
  ];

  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
