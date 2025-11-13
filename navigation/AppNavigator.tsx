import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import BoothDashboardScreen from '../screens/BoothDashboardScreen';
import AudioCollectionScreen from '../screens/AudioCollectionScreen';
import PollsScreen from '../screens/PollsScreen';
import FormsScreen from '../screens/FormsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for main app screens
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1E40AF',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={BoothDashboardScreen}
        options={{
          tabBarLabel: 'Booth',
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon name="person" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Material Icon component for tab bar icons
function TabIcon({ name, color }: { name: string; color: string }) {
  const iconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    home: 'home',
    person: 'person',
  };

  return <MaterialIcons name={iconMap[name] || 'help'} size={24} color={color} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="AudioCollection" component={AudioCollectionScreen} />
            <Stack.Screen name="Polls" component={PollsScreen} />
            <Stack.Screen name="Forms" component={FormsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
