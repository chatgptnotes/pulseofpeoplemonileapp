# Component Library Quick Reference Guide

## 📦 Import Path
```typescript
import { Card, Avatar, StatCard, SkeletonLoader } from '../components/ui';
import { ActivityFeedItem } from '../components/feed';
```

---

## 🎴 Card Component

### Basic Usage
```typescript
<Card>
  <Text>Your content here</Text>
</Card>
```

### With Gradient
```typescript
<Card
  gradient
  gradientColors={['#3B82F6', '#2563EB']}
>
  <Text style={{ color: '#FFFFFF' }}>Gradient Card</Text>
</Card>
```

### Touchable Card
```typescript
<Card onPress={() => navigation.navigate('Screen')}>
  <Text>Tap me!</Text>
</Card>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Card content |
| `style` | ViewStyle | undefined | Custom styles |
| `gradient` | boolean | false | Enable gradient background |
| `gradientColors` | string[] | ['#FFFFFF', '#FFFFFF'] | Gradient colors |
| `onPress` | () => void | undefined | Makes card touchable |
| `elevated` | boolean | true | Shadow/elevation |

---

## 👤 Avatar Component

### Basic Usage
```typescript
<Avatar name="John Doe" />
```

### With Image
```typescript
<Avatar
  name="John Doe"
  imageUrl="https://example.com/avatar.jpg"
  size={60}
/>
```

### With Online Badge
```typescript
<Avatar
  name="John Doe"
  showBadge
  badgeColor="#10B981"
  size={48}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | 'User' | User's name for initials |
| `imageUrl` | string | undefined | Avatar image URL |
| `size` | number | 40 | Avatar diameter in pixels |
| `showBadge` | boolean | false | Show status badge |
| `badgeColor` | string | '#10B981' | Badge color |
| `style` | ViewStyle | undefined | Custom styles |

### Features
- Auto-generates gradient based on name
- Shows initials when no image
- 8 unique gradient combinations
- Online status indicator

---

## 📊 StatCard Component

### Basic Usage
```typescript
<StatCard
  title="Total Collected"
  value={125}
  subtitle="This month"
  icon="trending-up"
  iconColor="#10B981"
/>
```

### With Trend
```typescript
<StatCard
  title="Completion Rate"
  value="87%"
  subtitle="Above target"
  icon="done-all"
  iconColor="#3B82F6"
  trend="up"
  trendValue="+5%"
/>
```

### With Gradient
```typescript
<StatCard
  title="Daily Goal"
  value={50}
  gradient
  gradientColors={['#F093FB', '#F5576C']}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | required | Card title |
| `value` | string \| number | required | Main value to display |
| `subtitle` | string | undefined | Additional text |
| `icon` | MaterialIcon | undefined | Icon name |
| `iconColor` | string | '#6B7280' | Icon color |
| `trend` | 'up' \| 'down' \| 'neutral' | undefined | Trend direction |
| `trendValue` | string | undefined | Trend text (e.g., "+12%") |
| `gradient` | boolean | false | Enable gradient |
| `gradientColors` | string[] | ['#FFFFFF', '#FFFFFF'] | Gradient colors |
| `style` | ViewStyle | undefined | Custom styles |

---

## ⏳ SkeletonLoader Component

### Single Skeleton
```typescript
<SkeletonLoader width="80%" height={20} borderRadius={8} />
```

### Full Card Skeleton
```typescript
<SkeletonCard />
```

### Custom Skeleton
```typescript
<SkeletonLoader
  width={120}
  height={120}
  borderRadius={60} // Circular
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | number \| string | '100%' | Skeleton width |
| `height` | number | 20 | Skeleton height |
| `borderRadius` | number | 8 | Corner radius |
| `style` | ViewStyle | undefined | Custom styles |

### SkeletonCard
Pre-built skeleton for activity feed cards. No props needed.

---

## 📱 ActivityFeedItem Component

### Basic Usage
```typescript
const activity: ActivityItem = {
  id: '123',
  type: 'audio',
  agentName: 'John Doe',
  agentId: 'user123',
  title: 'Audio Recording',
  description: 'Recorded conversation with voter',
  timestamp: '2024-01-15T10:30:00Z',
  location: 'Booth 12, Ward 3',
  metadata: {
    voterCount: 1,
    duration: '3:45',
    category: 'Employment'
  }
};

<ActivityFeedItem
  item={activity}
  onPress={() => console.log('Tapped')}
/>
```

### ActivityItem Interface
```typescript
interface ActivityItem {
  id: string;
  type: 'audio' | 'poll' | 'form' | 'system';
  agentName: string;
  agentId: string;
  title: string;
  description: string;
  timestamp: string; // ISO format
  location?: string;
  metadata?: {
    voterCount?: number;
    category?: string;
    duration?: string;
  };
}
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `item` | ActivityItem | required | Activity data |
| `onPress` | () => void | undefined | Tap handler |

### Features
- Color-coded by activity type
- Smart timestamp formatting
- Agent avatar with type badge
- Location display
- Metadata chips
- Category tags

---

## 🎨 Color Guidelines

### Feature Colors
```typescript
const FEATURE_COLORS = {
  audio: '#EF4444',    // Red
  polls: '#3B82F6',    // Blue
  forms: '#10B981',    // Green
  system: '#6B7280',   // Gray
};
```

### Gradient Examples
```typescript
// Blue gradient (default)
gradientColors={['#1E40AF', '#3B82F6', '#60A5FA']}

// Red gradient
gradientColors={['#DC2626', '#EF4444']}

// Green gradient
gradientColors={['#059669', '#10B981']}

// Purple gradient
gradientColors={['#7C3AED', '#A78BFA']}
```

---

## 📐 Spacing Scale

```typescript
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};
```

---

## 🎯 Common Patterns

### Loading State Pattern
```typescript
{loading ? (
  <>
    <SkeletonCard />
    <SkeletonCard />
  </>
) : (
  data.map(item => <ActivityFeedItem key={item.id} item={item} />)
)}
```

### Empty State Pattern
```typescript
{items.length === 0 ? (
  <Card style={styles.emptyState}>
    <MaterialIcons name="inbox" size={48} color="#D1D5DB" />
    <Text style={styles.emptyText}>No data yet</Text>
    <Text style={styles.emptySubtext}>Start collecting to see results</Text>
  </Card>
) : (
  items.map(item => <Component key={item.id} {...item} />)
)}
```

### Pull-to-Refresh Pattern
```typescript
const [refreshing, setRefreshing] = useState(false);

const onRefresh = useCallback(() => {
  setRefreshing(true);
  loadData().finally(() => setRefreshing(false));
}, []);

<ScrollView
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
  {/* Content */}
</ScrollView>
```

---

## 🚀 Performance Tips

1. **Use SkeletonLoader during data fetch**
   - Improves perceived performance
   - Better than spinners

2. **Memoize callbacks**
   ```typescript
   const onPress = useCallback(() => {
     navigation.navigate('Screen');
   }, [navigation]);
   ```

3. **Key props for lists**
   ```typescript
   {items.map(item => <Component key={item.id} {...item} />)}
   ```

4. **Conditional rendering**
   ```typescript
   {show && <Component />}  // ✅ Good
   {show ? <Component /> : null}  // ❌ Unnecessary
   ```

---

## 🎓 Examples

### Feature Card (Horizontal Scroll)
```typescript
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
>
  {features.map((feature) => (
    <Card
      key={feature.id}
      gradient
      gradientColors={[feature.color, `${feature.color}CC`]}
      onPress={() => navigate(feature.screen)}
      style={{ width: 160, height: 180, marginRight: 16 }}
    >
      <MaterialIcons name={feature.icon} size={32} color="#FFFFFF" />
      <Text style={styles.title}>{feature.title}</Text>
      <Text style={styles.description}>{feature.description}</Text>
    </Card>
  ))}
</ScrollView>
```

### Stats Grid
```typescript
<View style={{ flexDirection: 'row', gap: 16 }}>
  <StatCard
    title="Audio"
    value={25}
    icon="mic"
    iconColor="#EF4444"
    trend="up"
    trendValue="+12%"
    style={{ flex: 1 }}
  />
  <StatCard
    title="Polls"
    value={40}
    icon="poll"
    iconColor="#3B82F6"
    trend="up"
    trendValue="+8%"
    style={{ flex: 1 }}
  />
</View>
```

### Activity Feed
```typescript
<View>
  {loading ? (
    <>
      <SkeletonCard />
      <SkeletonCard />
    </>
  ) : activities.length > 0 ? (
    activities.map((activity) => (
      <ActivityFeedItem
        key={activity.id}
        item={activity}
        onPress={() => viewDetails(activity)}
      />
    ))
  ) : (
    <Card>
      <MaterialIcons name="inbox" size={48} color="#D1D5DB" />
      <Text>No activities yet</Text>
    </Card>
  )}
</View>
```

---

## 🐛 Troubleshooting

### Component not found
```typescript
// ❌ Wrong
import { Card } from '../components/ui/Card';

// ✅ Correct
import { Card } from '../components/ui';
```

### Gradient not showing
```typescript
// ❌ Missing gradient prop
<Card gradientColors={['#000', '#FFF']}>

// ✅ Correct
<Card gradient gradientColors={['#000', '#FFF']}>
```

### Avatar not updating
```typescript
// ❌ Same name won't trigger re-render
<Avatar name="John" />

// ✅ Use key prop to force re-render
<Avatar key={userId} name={userName} />
```

---

## 📚 Resources

- **Material Icons:** https://icons.expo.fyi/
- **Color Palette:** Tailwind CSS colors
- **Design System:** Following Instagram & modern mobile patterns

---

Happy coding! 🎉
