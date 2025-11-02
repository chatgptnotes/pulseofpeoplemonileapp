import { supabase, User, UserRole } from './supabase';

// Permission types based on voter project RBAC system
export type Permission =
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'users.manage_roles'
  | 'data.view_dashboard'
  | 'data.view_analytics'
  | 'data.view_reports'
  | 'data.export'
  | 'data.import'
  | 'data.surveys'
  | 'data.download_reports'
  | 'voters.view'
  | 'voters.edit'
  | 'voters.delete'
  | 'field_workers.view'
  | 'field_workers.manage'
  | 'field_workers.view_reports'
  | 'field_workers.submit_reports'
  | 'social_media.view'
  | 'social_media.manage_channels'
  | 'ai_analytics.view_competitor'
  | 'ai_analytics.view_insights'
  | 'ai_analytics.generate_insights'
  | 'settings.view'
  | 'settings.edit'
  | 'settings.manage_billing'
  | 'alerts.view'
  | 'alerts.manage'
  | 'system.manage_orgs'
  | 'system.view_all_data'
  | 'system.manage_settings'
  | 'system.view_audit_logs';

// Role-based permissions mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    'users.view', 'users.create', 'users.edit', 'users.delete', 'users.manage_roles',
    'data.view_dashboard', 'data.view_analytics', 'data.view_reports', 'data.export', 'data.import', 'data.surveys', 'data.download_reports',
    'voters.view', 'voters.edit', 'voters.delete',
    'field_workers.view', 'field_workers.manage', 'field_workers.view_reports', 'field_workers.submit_reports',
    'social_media.view', 'social_media.manage_channels',
    'ai_analytics.view_competitor', 'ai_analytics.view_insights', 'ai_analytics.generate_insights',
    'settings.view', 'settings.edit', 'settings.manage_billing',
    'alerts.view', 'alerts.manage',
    'system.manage_orgs', 'system.view_all_data', 'system.manage_settings', 'system.view_audit_logs'
  ],
  admin: [
    'users.view', 'users.create', 'users.edit', 'users.delete', 'users.manage_roles',
    'data.view_dashboard', 'data.view_analytics', 'data.view_reports', 'data.export', 'data.import', 'data.surveys', 'data.download_reports',
    'voters.view', 'voters.edit', 'voters.delete',
    'field_workers.view', 'field_workers.manage', 'field_workers.view_reports',
    'social_media.view', 'social_media.manage_channels',
    'ai_analytics.view_competitor', 'ai_analytics.view_insights', 'ai_analytics.generate_insights',
    'settings.view', 'settings.edit', 'settings.manage_billing',
    'alerts.view', 'alerts.manage',
    'system.view_audit_logs'
  ],
  manager: [
    'users.view', 'users.create', 'users.edit',
    'data.view_dashboard', 'data.view_analytics', 'data.view_reports', 'data.export', 'data.surveys', 'data.download_reports',
    'voters.view', 'voters.edit',
    'field_workers.view', 'field_workers.manage', 'field_workers.view_reports',
    'social_media.view',
    'ai_analytics.view_competitor', 'ai_analytics.view_insights',
    'settings.view',
    'alerts.view', 'alerts.manage'
  ],
  analyst: [
    'data.view_dashboard', 'data.view_analytics', 'data.view_reports', 'data.export', 'data.download_reports',
    'voters.view',
    'field_workers.view', 'field_workers.view_reports',
    'social_media.view',
    'ai_analytics.view_competitor', 'ai_analytics.view_insights',
    'alerts.view'
  ],
  user: [
    'data.view_dashboard', 'data.view_reports',
    'voters.view',
    'field_workers.view_reports',
    'social_media.view',
    'alerts.view'
  ],
  viewer: [
    'data.view_dashboard',
    'alerts.view'
  ],
  volunteer: [
    'field_workers.submit_reports',
    'data.view_dashboard',
    'alerts.view'
  ]
};

export class AuthService {
  // Sign up new user
  static async signUp(
    email: string,
    password: string,
    fullName: string,
    phone?: string,
    role: UserRole = 'voter'
  ) {
    try {
      // Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Failed to create user');

      // Create user profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email,
          name: fullName,
          phone,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create user profile');
      }

      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch user profile with role
      const user = await this.getCurrentUser();

      return { user, session: data.session };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Get current user with profile
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) return null;

      // Fetch user profile from users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return userData as User;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Check if user has permission
  static hasPermission(userRole: UserRole, permission: Permission): boolean {
    const permissions = rolePermissions[userRole] || [];
    return permissions.includes(permission);
  }

  // Get all permissions for a role
  static getPermissions(userRole: UserRole): Permission[] {
    return rolePermissions[userRole] || [];
  }

  // Check multiple permissions
  static hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(userRole, permission));
  }

  // Check if all permissions are granted
  static hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(userRole, permission));
  }

  // Update last login time
  static async updateLastLogin(userId: string) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Update last login error:', error);
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}
