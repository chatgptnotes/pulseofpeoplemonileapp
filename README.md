# Pulse of People - Mobile App

A production-ready React Native mobile application for political intelligence, voter sentiment analysis, and campaign management. Built for political campaigns, election teams, and regional political organizations.

**Companion mobile app for the Pulse of People voter sentiment analysis platform.**

## Overview

Pulse of People Mobile provides field workers, volunteers, campaign managers, and analysts with on-the-go access to real-time voter sentiment data, social media monitoring, field report submission, and AI-driven political intelligence.

### Key Capabilities

- **Real-Time Sentiment Analysis** - Monitor voter sentiments across 9 emotions with positive/negative/neutral breakdowns
- **Field Operations** - Submit and manage ground-level field reports with GPS tagging and photos
- **Social Media Monitoring** - Track sentiment across Twitter, Facebook, Instagram, YouTube, and WhatsApp
- **Alerts & Notifications** - Receive critical alerts for sentiment spikes, volume surges, and crisis situations
- **Analytics Dashboard** - Visualize trends, source breakdowns, and time-series sentiment data
- **Role-Based Access** - 7 user roles with 33 granular permissions for secure data access

## Features

### Authentication & Security
- Supabase authentication with email/password login
- Role-Based Access Control (RBAC) system
- Session management with auto-refresh
- Secure credential storage
- Permission-based feature visibility

### User Roles & Permissions

1. **Super Admin** - Platform owner with full system access
2. **Admin** - Organization owner, manages tenants and users
3. **Manager** - Campaign manager with limited user management
4. **Analyst** - Data analyst with read access to analytics
5. **User** - Regular user with basic access
6. **Viewer** - Read-only dashboard access
7. **Volunteer** - Field worker who can submit reports

### Core Screens

#### Dashboard
- Sentiment overview with visual breakdown
- Overall sentiment score (-1 to 1 scale)
- Quick action cards for common tasks
- Recent alerts display
- Pull-to-refresh functionality

#### Field Report Submission
- Complete form (title, description, type, sentiment, priority)
- Camera and gallery integration
- GPS location capture with reverse geocoding
- Image upload to Supabase storage
- Real-time validation

#### Alerts
- Real-time alerts from Supabase
- Filter by severity (info, warning, critical)
- Mark as read functionality
- Unread count badges

#### Social Media Monitoring
- Multi-platform post viewing
- Platform filters (Twitter, Facebook, Instagram, YouTube, WhatsApp)
- Engagement metrics display
- Sentiment indicators
- Influencer badges

#### Analytics
- Sentiment trend charts
- Time range selector (7d, 30d, 90d)
- Source breakdown pie charts
- Statistics cards
- Export functionality

#### Profile
- Account information
- Role and status indicators
- Settings menu
- Logout functionality

### Coming Soon Features

- Surveys management and response collection
- Voter database with DPDP compliance
- Competitor analysis dashboards
- AI insights and recommendations
- Geographic heatmaps with ward-level data
- Multi-language support (12 languages)
- Push notifications
- Offline mode

## Tech Stack

### Core Technologies
- **React Native** 0.79.6
- **Expo** SDK 53
- **TypeScript** 5.9.3
- **React Navigation** 7.x (Stack + Bottom Tabs)

### Backend & Data
- **Supabase** - PostgreSQL database, authentication, real-time subscriptions
- **AsyncStorage** - Local data persistence
- **Supabase Storage** - Image and media uploads

### UI & Visualization
- **Expo Linear Gradient** - Beautiful gradient backgrounds
- **React Native Chart Kit** - Charts and visualizations
- **React Native SVG** - Vector graphics

### Device Features
- **Expo Location** - GPS and geocoding
- **Expo Image Picker** - Camera and gallery access
- **Expo Camera** - Camera permissions

## Prerequisites

- **Node.js** 18+ and npm 9+
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (macOS) or **Android Emulator**
- **Supabase Account** with voter project database
- **Physical device** recommended for GPS and camera features

## Quick Start

### 1. Clone and Install

```bash
# Navigate to project directory
cd pulse-of-people-mobile

# Install dependencies
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
# Copy example file
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
# Supabase Configuration (Required)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Multi-Tenant (Optional)
EXPO_PUBLIC_MULTI_TENANT=false
EXPO_PUBLIC_TENANT_ID=your_tenant_id

# AI Features (Optional)
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

Get your Supabase credentials:
- Supabase URL: https://app.supabase.com/project/_/settings/api
- Anon Key: https://app.supabase.com/project/_/settings/api

### 3. Prebuild for Native Features

```bash
# Required for first run (camera, location, etc.)
npx expo prebuild
```

### 4. Run the App

```bash
# Start development server
npm start

# Run on iOS (macOS only)
npm run ios

# Run on Android
npm run android
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run ios` | Run on iOS simulator/device |
| `npm run android` | Run on Android emulator/device |
| `npm run prebuild` | Generate native project files |
| `npm run lint` | Check code quality with ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run build:ios` | Build iOS app with EAS |
| `npm run build:android` | Build Android app with EAS |

## Project Structure

```
pulse-of-people-mobile/
├── App.tsx                          # Main app entry point
├── screens/                         # Screen components
│   ├── LoginScreen.tsx              # Authentication
│   ├── DashboardScreen.tsx          # Main dashboard
│   ├── SubmitReportScreen.tsx       # Field report submission
│   ├── AlertsScreen.tsx             # Alerts management
│   ├── AnalyticsScreen.tsx          # Analytics dashboard
│   ├── SocialMediaScreen.tsx        # Social media monitoring
│   ├── ProfileScreen.tsx            # User profile
│   ├── SurveysScreen.tsx            # Surveys (placeholder)
│   ├── VoterDatabaseScreen.tsx      # Voter DB (placeholder)
│   ├── CompetitorAnalysisScreen.tsx # Competitor tracking (placeholder)
│   ├── AIInsightsScreen.tsx         # AI insights (placeholder)
│   └── FieldReportsScreen.tsx       # Reports management (placeholder)
│
├── navigation/                      # Navigation configuration
│   └── AppNavigator.tsx             # Stack and Tab navigators
│
├── contexts/                        # React Context providers
│   └── AuthContext.tsx              # Authentication state
│
├── services/                        # Business logic services
│   ├── supabase.ts                  # Supabase client + types
│   └── auth.ts                      # Authentication service + RBAC
│
├── utils/                           # Utility functions
│   ├── deviceTools.ts               # Device utilities
│   └── geminiService.ts             # Gemini AI integration
│
├── assets/                          # Images and icons
│   └── icon.png                     # App icon
│
├── .env.example                     # Environment template
├── app.config.js                    # Expo configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── VERSION                          # Current version
├── CHANGELOG.md                     # Version history
└── README.md                        # This file
```

## Database Schema

The app integrates with the voter project Supabase database:

### Core Tables
- `users` - User accounts with roles and permissions
- `sentiment_data` - Sentiment analysis results
- `field_reports` - Field worker submissions
- `alerts` - Real-time alerts and notifications
- `social_posts` - Social media content
- `surveys` - Survey campaigns
- `survey_questions` - Survey question bank
- `survey_responses` - Anonymized responses
- `volunteers` - Field worker management
- `recommendations` - AI-generated insights
- `voters` - Privacy-compliant voter database
- `media_coverage` - News monitoring
- `competitor_activity` - Opposition tracking
- `campaign_events` - Event management

### Security
- Row Level Security (RLS) policies
- Encrypted credential storage
- DPDP Act compliance
- Audit logging

## Permissions System

### Permission Categories

**Users Management** (5 permissions)
- `users.view`, `users.create`, `users.edit`, `users.delete`, `users.manage_roles`

**Data Access** (7 permissions)
- `data.view_dashboard`, `data.view_analytics`, `data.view_reports`, `data.export`, `data.import`, `data.surveys`, `data.download_reports`

**Voters** (3 permissions)
- `voters.view`, `voters.edit`, `voters.delete`

**Field Workers** (4 permissions)
- `field_workers.view`, `field_workers.manage`, `field_workers.view_reports`, `field_workers.submit_reports`

**Social Media** (2 permissions)
- `social_media.view`, `social_media.manage_channels`

**AI & Analytics** (3 permissions)
- `ai_analytics.view_competitor`, `ai_analytics.view_insights`, `ai_analytics.generate_insights`

**Settings** (3 permissions)
- `settings.view`, `settings.edit`, `settings.manage_billing`

**Alerts** (2 permissions)
- `alerts.view`, `alerts.manage`

**System** (4 permissions)
- `system.manage_orgs`, `system.view_all_data`, `system.manage_settings`, `system.view_audit_logs`

## Platform Support

- **iOS**: Full support (requires development build)
- **Android**: Full support (requires development build)
- **Expo Go**: Not supported (requires native modules)
- **Physical Devices**: Recommended for GPS, camera, and full functionality

## Testing

### Local Development

**iOS Simulator:**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

**Physical Device:**
1. Install Expo Go app
2. Scan QR code from `npm start`
3. Or build development client with `eas build --profile development`

### Testing Accounts

Create test users in Supabase with different roles:

```sql
-- Example: Create a volunteer user
INSERT INTO users (id, email, full_name, role, is_active)
VALUES (
  'user-uuid-here',
  'volunteer@example.com',
  'Test Volunteer',
  'volunteer',
  true
);
```

## Building for Production

### Using EAS Build

```bash
# Configure EAS
eas login
eas init

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both
eas build --platform all
```

### App Store Submission

**iOS:**
1. Build with EAS: `eas build --platform ios`
2. Download .ipa file
3. Upload to App Store Connect
4. Submit for review

**Android:**
1. Build with EAS: `eas build --platform android`
2. Download .aab file
3. Upload to Google Play Console
4. Submit for review

## Troubleshooting

### Common Issues

**"Failed to connect to Supabase"**
- Verify EXPO_PUBLIC_SUPABASE_URL in .env
- Check EXPO_PUBLIC_SUPABASE_ANON_KEY
- Ensure internet connection

**"Camera/Location permission denied"**
- Check app permissions in device settings
- iOS: Settings > Privacy > Camera/Location
- Android: Settings > Apps > Pulse of People > Permissions

**"Native module errors"**
- Run `npx expo prebuild --clean`
- Delete node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npx expo start --clear`

**"Charts not displaying"**
- Install chart dependencies: `npm install react-native-chart-kit react-native-svg`
- Rebuild app: `npx expo prebuild`

### iOS Specific

**Simulator Setup:**
- Xcode must be installed
- Accept Xcode license: `sudo xcodebuild -license`
- Install simulators: Xcode > Preferences > Components

**Physical Device:**
- Requires Apple Developer account
- Configure signing in Xcode
- Trust developer certificate on device

### Android Specific

**Emulator Setup:**
- Android Studio must be installed
- SDK Platform 35 required
- Create AVD in Android Studio

**Physical Device:**
- Enable Developer Options
- Enable USB Debugging
- Trust computer when prompted

## Security Best Practices

- Never commit `.env` file
- Rotate API keys regularly
- Use Row Level Security in Supabase
- Validate all user inputs
- Enable 2FA for admin accounts
- Keep dependencies updated
- Monitor Supabase logs

## Performance Optimization

- Use React.memo for expensive components
- Implement virtual lists for long data
- Optimize images before upload
- Use pagination for large datasets
- Cache API responses
- Lazy load screens

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

**Current Version:** 1.0.0

## License

MIT License

## Support

For issues and questions:
- GitHub Issues: https://github.com/chatgptnotes/pulseofpeoplemonileapp/issues
- Documentation: See docs in repository
- Email: support@pulseofpeople.com (if applicable)

## Acknowledgments

- Built with Expo and React Native
- Powered by Supabase
- Integrated with voter sentiment analysis platform
- Based on the Pulse of People web application

---

**v1.0 - Built with Claude Code Autonomous Agent**

**Test Access:**
- Local Development: http://localhost:8081 (Metro bundler)
- iOS Simulator: `npm run ios`
- Android Emulator: `npm run android`
- Physical Device: Use Expo Dev Client or EAS Build
