import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types based on voter project schema
export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'analyst'
  | 'user'
  | 'viewer'
  | 'volunteer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization_id?: string;
  tenant_id?: string;
  phone?: string;
  avatar?: string;
  is_active?: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface SentimentData {
  id: string;
  source: 'twitter' | 'facebook' | 'instagram' | 'whatsapp' | 'field_report' | 'survey' | 'news';
  text: string;
  sentiment_score: number; // -1 to 1
  polarity: 'positive' | 'negative' | 'neutral';
  emotions: {
    anger?: number;
    trust?: number;
    fear?: number;
    hope?: number;
    pride?: number;
    joy?: number;
    sadness?: number;
    surprise?: number;
    disgust?: number;
  };
  language: string;
  location?: {
    ward?: string;
    constituency?: string;
    state?: string;
    coordinates?: { lat: number; lng: number };
  };
  metadata?: Record<string, any>;
  created_at: string;
  tenant_id?: string;
}

export interface FieldReport {
  id: string;
  volunteer_id: string;
  title: string;
  description: string;
  report_type: 'ground_feedback' | 'event_coverage' | 'issue' | 'opportunity';
  sentiment: 'positive' | 'negative' | 'neutral';
  location: {
    ward?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  media_urls?: string[];
  tags?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'reviewed' | 'actioned' | 'closed';
  created_at: string;
  tenant_id?: string;
}

export interface Alert {
  id: string;
  type: 'sentiment_spike' | 'volume_surge' | 'crisis' | 'opportunity' | 'custom';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  source_type?: string;
  metadata?: Record<string, any>;
  is_read: boolean;
  created_at: string;
  tenant_id?: string;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  start_date?: string;
  end_date?: string;
  target_demographics?: Record<string, any>;
  total_responses: number;
  created_at: string;
  tenant_id?: string;
}

export interface SocialPost {
  id: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'whatsapp';
  content: string;
  author: string;
  author_handle?: string;
  engagement_metrics: {
    likes?: number;
    shares?: number;
    comments?: number;
    views?: number;
    reach?: number;
  };
  sentiment_score?: number;
  is_influencer: boolean;
  post_url?: string;
  posted_at: string;
  created_at: string;
  tenant_id?: string;
}

export interface Recommendation {
  id: string;
  type: 'strategic' | 'tactical' | 'crisis_response' | 'opportunity';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  confidence_score: number; // 0-1
  supporting_data?: Record<string, any>;
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';
  created_at: string;
  tenant_id?: string;
}
