# Working API Credentials - Pulse of People

## Production Environment Variables

Copy these to your `.env` file:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://iwtgbseaoztjbnvworyq.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dGdic2Vhb3p0amJudndvcnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNjAzOTksImV4cCI6MjA3NjczNjM5OX0.xA4B0XZJE_4MdjFCkw2yVsf4vlHmHfpeV6Bk5tG2T94

# Google Gemini AI Configuration
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyB02s10O026P1yJzY2vjqlFf0rH-LmWF9U

# ElevenLabs Voice AI Configuration
EXPO_PUBLIC_AGENT_ID=agent_7901k7vk4bx8fxdbzgewvdnvrn2z
EXPO_PUBLIC_ELEVENLABS_API_KEY=sk_9c244c8231d6991f3b12319141016d60b7d120f36f1612dd
```

## Quick Setup

1. Copy the above credentials to your `.env` file
2. Restart the Metro bundler: `npx expo start`
3. Connect your device using: `exp://192.168.1.5:8081`

## Service Details

### Supabase
- **Project URL**: https://iwtgbseaoztjbnvworyq.supabase.co
- **Dashboard**: https://app.supabase.com/project/iwtgbseaoztjbnvworyq
- **Purpose**: Database, Authentication, Storage
- **Key Expiry**: 2076-07-36 (50+ years)

### Google Gemini
- **API Console**: https://aistudio.google.com/app/apikey
- **Purpose**: AI-powered insights and analysis
- **Model**: Gemini Pro

### ElevenLabs
- **Agent Dashboard**: https://elevenlabs.io/app/conversational-ai/agents
- **Purpose**: Voice AI conversations
- **Agent ID**: agent_7901k7vk4bx8fxdbzgewvdnvrn2z

## Connection Info

### Local Development
- **Metro Bundler**: http://localhost:8081
- **Local IP**: 192.168.1.5
- **Device URL**: exp://192.168.1.5:8081

### iPhone Setup
1. Install "Pulse of People" development build on device
2. Open the app
3. Enter URL manually: `exp://192.168.1.5:8081`
4. App will connect and load

## Security Notes

- These are development/testing credentials
- Supabase anon key is safe for client-side use (row-level security enforced)
- For production, rotate all keys and use environment-specific configs
- Never commit production secrets to git

## Test Login Credentials

### IMPORTANT: Creating Test Users

**Option 1: Use the App Signup Screen (Recommended)**
1. Open the app on your iPhone
2. Tap "Don't have an account? Sign Up"
3. Fill in the form with your details
4. Select your role (Voter, Field Worker, or Admin)
5. Tap "Sign Up"
6. After success, return to Login and sign in

**Option 2: Create via Supabase Dashboard + SQL**

If you create users directly in Supabase Auth Dashboard, you MUST also create the user profile in the `users` table, otherwise login will fail with "Error fetching user profile: PGRST116".

Steps:
1. Go to: https://app.supabase.com/project/iwtgbseaoztjbnvworyq/auth/users
2. Create user via "Add User" → "Create new user"
3. Copy the user's ID from the auth.users table
4. Run this SQL in SQL Editor (https://app.supabase.com/project/iwtgbseaoztjbnvworyq/sql):

```sql
INSERT INTO users (id, email, full_name, role, phone, created_at, updated_at)
VALUES (
  'USER_ID_FROM_AUTH_USERS',  -- Replace with actual user ID
  'user@example.com',          -- User's email
  'Full Name',                 -- User's full name
  'voter',                     -- Role: 'voter', 'field_worker', 'admin', etc.
  '+1234567890',               -- Phone (optional)
  NOW(),
  NOW()
);
```

**Recommended Test Accounts:**

1. **Admin User**
   - Email: `admin@pulseofpeople.com`
   - Password: `Admin@123456`
   - Role: `admin`

2. **Field Worker**
   - Email: `fieldworker@pulseofpeople.com`
   - Password: `Worker@123456`
   - Role: `field_worker`

3. **Voter/Citizen**
   - Email: `voter@pulseofpeople.com`
   - Password: `Voter@123456`
   - Role: `voter`

### Creating Users in Supabase

1. Go to: https://app.supabase.com/project/iwtgbseaoztjbnvworyq/auth/users
2. Click "Add User" → "Create new user"
3. Enter email and password
4. Click "Create user"
5. After creation, assign role in the `users` table

**Quick SQL to Create Test Users:**

```sql
-- Run in Supabase SQL Editor
-- https://app.supabase.com/project/iwtgbseaoztjbnvworyq/sql

-- Insert test users (run after they've signed up via auth)
INSERT INTO users (id, email, full_name, role, phone)
VALUES
  ((SELECT id FROM auth.users WHERE email = 'admin@pulseofpeople.com'),
   'admin@pulseofpeople.com', 'Admin User', 'admin', '+1234567890'),
  ((SELECT id FROM auth.users WHERE email = 'fieldworker@pulseofpeople.com'),
   'fieldworker@pulseofpeople.com', 'Field Worker', 'field_worker', '+1234567891'),
  ((SELECT id FROM auth.users WHERE email = 'voter@pulseofpeople.com'),
   'voter@pulseofpeople.com', 'Voter User', 'voter', '+1234567892')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name;
```

## Troubleshooting

### App won't connect?
- Ensure Mac and iPhone are on same WiFi network (192.168.1.x)
- Check Metro bundler is running: `lsof -i :8081`
- Verify IP address: `ifconfig | grep "inet "`

### Can't login?
- Create test users in Supabase Dashboard first
- Use the credentials listed above
- Check Supabase auth logs for errors

### API errors?
- Check Supabase project status at dashboard
- Verify API keys haven't been rotated
- Check API quotas/limits

---

**Last Updated**: 2025-11-02
**Version**: 1.0
