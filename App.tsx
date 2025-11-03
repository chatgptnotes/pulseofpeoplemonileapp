import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ElevenLabsProvider } from '@elevenlabs/react-native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <ElevenLabsProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ElevenLabsProvider>
  );
}
