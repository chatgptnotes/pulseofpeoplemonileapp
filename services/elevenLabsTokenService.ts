/**
 * ElevenLabs Token Service
 * Handles fetching conversation tokens for authenticated agent access
 */

import Constants from 'expo-constants';

/**
 * Fetch a signed conversation token from ElevenLabs
 * This is required for private agents that need API key authentication
 */
export async function fetchConversationToken(agentId: string): Promise<string> {
  // Try to get API key from multiple sources
  const apiKey =
    Constants.expoConfig?.extra?.EXPO_PUBLIC_ELEVENLABS_API_KEY ||
    process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;

  console.log('Constants.expoConfig?.extra:', Constants.expoConfig?.extra);
  console.log('API Key available:', !!apiKey);

  if (!apiKey) {
    throw new Error('ElevenLabs API key not configured');
  }

  try {
    console.log('Fetching token for agent:', agentId);

    // Try the conversation token endpoint (POST)
    const response = await fetch(
      'https://api.elevenlabs.io/v1/convai/conversation/get_signed_url',
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId,
        }),
      }
    );

    console.log('Token response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('Token fetch error:', error);
      throw new Error(`Failed to fetch token: ${response.status} ${error}`);
    }

    const data = await response.json();
    console.log('Token response data:', data);

    // The response should contain a signed_url field
    if (!data.signed_url) {
      console.error('No signed_url in response:', data);
      throw new Error('Invalid token response: missing signed_url');
    }

    return data.signed_url;
  } catch (error) {
    console.error('Error fetching conversation token:', error);
    throw error;
  }
}
