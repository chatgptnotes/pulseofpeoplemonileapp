import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FieldReportsScreen from '../screens/FieldReportsScreen';
import SocialMediaScreen from '../screens/SocialMediaScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SubmitReportScreen from '../screens/SubmitReportScreen';
import SurveysScreen from '../screens/SurveysScreen';
import VoterDatabaseScreen from '../screens/VoterDatabaseScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import CompetitorAnalysisScreen from '../screens/CompetitorAnalysisScreen';
import AIInsightsScreen from '../screens/AIInsightsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for main app screens
function MainTabs() {
  const { user, hasPermission, isRole } = useAuth();

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
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <TabIcon name="dashboard" color={color} />,
        }}
      />

      {hasPermission('field_workers.submit_reports') && (
        <Tab.Screen
          name="Submit"
          component={SubmitReportScreen}
          options={{
            tabBarLabel: 'Report',
            tabBarIcon: ({ color }) => <TabIcon name="add-circle" color={color} />,
          }}
        />
      )}

      {hasPermission('alerts.view') && (
        <Tab.Screen
          name="Alerts"
          component={AlertsScreen}
          options={{
            tabBarLabel: 'Alerts',
            tabBarIcon: ({ color }) => <TabIcon name="notifications" color={color} />,
            tabBarBadge: 3, // TODO: Get actual unread count
          }}
        />
      )}

      {hasPermission('data.view_analytics') && (
        <Tab.Screen
          name="Analytics"
          component={AnalyticsScreen}
          options={{
            tabBarLabel: 'Analytics',
            tabBarIcon: ({ color}) => <TabIcon name="bar-chart" color={color} />,
          }}
        />
      )}

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
    dashboard: 'dashboard',
    'add-circle': 'add-circle',
    notifications: 'notifications',
    'bar-chart': 'bar-chart',
    person: 'person',
  };

  return <MaterialIcons name={iconMap[name] || 'help'} size={24} color={color} />;
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // TODO: Add loading screen
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
            <Stack.Screen name="FieldReports" component={FieldReportsScreen} />
            <Stack.Screen name="SocialMedia" component={SocialMediaScreen} />
            <Stack.Screen name="Surveys" component={SurveysScreen} />
            <Stack.Screen name="VoterDatabase" component={VoterDatabaseScreen} />
            <Stack.Screen name="CompetitorAnalysis" component={CompetitorAnalysisScreen} />
            <Stack.Screen name="AIInsights" component={AIInsightsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
