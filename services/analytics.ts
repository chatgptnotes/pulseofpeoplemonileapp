import { supabase } from './supabase';

export interface DashboardStats {
  todayAudio: number;
  todayPolls: number;
  todayForms: number;
  totalCollected: number;
  boothData?: BoothStats;
}

export interface BoothStats {
  boothNumber: string;
  totalVoters: number;
  collectedVoters: number;
  pendingVoters: number;
  completionRate: number;
  topIssues: Array<{ category: string; count: number }>;
}

export interface ActivityData {
  recentActivities: Array<{
    id: string;
    type: 'audio' | 'poll' | 'form';
    agent_name: string;
    agent_id: string;
    title: string;
    description: string;
    created_at: string;
    location?: string;
    metadata?: any;
  }>;
}

export class AnalyticsService {
  /**
   * Get dashboard statistics for today
   */
  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Get today's audio count
      const { count: audioCount } = await supabase
        .from('voter_calls')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', userId)
        .gte('created_at', todayISO);

      // Get today's poll count
      const { count: pollCount } = await supabase
        .from('poll_responses')
        .select('*', { count: 'exact', head: true })
        .eq('collected_by', userId)
        .gte('created_at', todayISO);

      // Get today's form count
      const { count: formCount } = await supabase
        .from('direct_feedback')
        .select('*', { count: 'exact', head: true })
        .eq('submitted_by', userId)
        .gte('created_at', todayISO);

      // Get total collected (all time)
      const total = (audioCount || 0) + (pollCount || 0) + (formCount || 0);

      return {
        todayAudio: audioCount || 0,
        todayPolls: pollCount || 0,
        todayForms: formCount || 0,
        totalCollected: total,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        todayAudio: 0,
        todayPolls: 0,
        todayForms: 0,
        totalCollected: 0,
      };
    }
  }

  /**
   * Get recent activities feed
   */
  static async getRecentActivities(
    userId: string,
    limit: number = 20
  ): Promise<ActivityData['recentActivities']> {
    try {
      const activities: ActivityData['recentActivities'] = [];

      // Fetch recent audio recordings
      const { data: audioData } = await supabase
        .from('voter_calls')
        .select('*')
        .eq('agent_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (audioData) {
        audioData.forEach((item) => {
          activities.push({
            id: item.id,
            type: 'audio',
            agent_name: item.agent_name || 'Unknown',
            agent_id: item.agent_id,
            title: 'Audio Recording',
            description: `Recorded conversation with ${item.voter_name}`,
            created_at: item.created_at,
            metadata: {
              duration: formatDuration(item.call_duration),
              voterCount: 1,
            },
          });
        });
      }

      // Fetch recent polls
      const { data: pollData } = await supabase
        .from('poll_responses')
        .select('*')
        .eq('collected_by', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (pollData) {
        pollData.forEach((item) => {
          activities.push({
            id: item.id,
            type: 'poll',
            agent_name: 'You',
            agent_id: userId,
            title: 'Poll Response',
            description: `${item.voter_name} responded: ${item.answer}`,
            created_at: item.created_at,
            metadata: {
              category: item.question?.substring(0, 30),
              voterCount: 1,
            },
          });
        });
      }

      // Fetch recent forms
      const { data: formData } = await supabase
        .from('direct_feedback')
        .select('*')
        .eq('submitted_by', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (formData) {
        formData.forEach((item) => {
          activities.push({
            id: item.id,
            type: 'form',
            agent_name: 'You',
            agent_id: userId,
            title: 'Feedback Form',
            description: `${item.citizen_name}: ${item.message_text?.substring(0, 80)}...`,
            created_at: item.created_at,
            metadata: {
              category: item.issue_category_id,
              voterCount: 1,
            },
          });
        });
      }

      // Sort by date
      activities.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return activities.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }

  /**
   * Get booth-specific statistics (if booth assignment exists)
   */
  static async getBoothStats(userId: string): Promise<BoothStats | null> {
    try {
      // This would need a booth_assignments table
      // For now, return aggregated data
      const { data: issues } = await supabase
        .from('direct_feedback')
        .select('issue_category_id')
        .eq('submitted_by', userId)
        .not('issue_category_id', 'is', null);

      const issueCounts: { [key: string]: number } = {};
      issues?.forEach((item) => {
        if (item.issue_category_id) {
          issueCounts[item.issue_category_id] =
            (issueCounts[item.issue_category_id] || 0) + 1;
        }
      });

      const topIssues = Object.entries(issueCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        boothNumber: 'N/A',
        totalVoters: 0,
        collectedVoters: 0,
        pendingVoters: 0,
        completionRate: 0,
        topIssues,
      };
    } catch (error) {
      console.error('Error fetching booth stats:', error);
      return null;
    }
  }

  /**
   * Get weekly trend data for charts
   */
  static async getWeeklyTrend(
    userId: string
  ): Promise<Array<{ date: string; audio: number; polls: number; forms: number }>> {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const dates: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }

      const trendData = await Promise.all(
        dates.map(async (date) => {
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);
          const nextDateISO = nextDate.toISOString();

          const { count: audioCount } = await supabase
            .from('voter_calls')
            .select('*', { count: 'exact', head: true })
            .eq('agent_id', userId)
            .gte('created_at', date)
            .lt('created_at', nextDateISO);

          const { count: pollCount } = await supabase
            .from('poll_responses')
            .select('*', { count: 'exact', head: true })
            .eq('collected_by', userId)
            .gte('created_at', date)
            .lt('created_at', nextDateISO);

          const { count: formCount } = await supabase
            .from('direct_feedback')
            .select('*', { count: 'exact', head: true })
            .eq('submitted_by', userId)
            .gte('created_at', date)
            .lt('created_at', nextDateISO);

          return {
            date,
            audio: audioCount || 0,
            polls: pollCount || 0,
            forms: formCount || 0,
          };
        })
      );

      return trendData;
    } catch (error) {
      console.error('Error fetching weekly trend:', error);
      return [];
    }
  }
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
