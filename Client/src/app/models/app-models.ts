export enum PlanTier {
  Starter = 'Starter',
  Pro = 'Pro',
  Enterprise = 'Enterprise'
}

export enum UserRole {
  CompanyAdmin = 'CompanyAdmin',
  User = 'User'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent'
}

export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Done = 'Done'
}

export interface Company {
  company_id: string;
  name: string;
  domain?: string;
  username?: string;
  email?: string;
  plan_tier: PlanTier;
  is_active: boolean;
  internal_notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface User {
  user_id: string;
  company_id: string;
  username: string;
  email: string;
  role: UserRole;
  full_name?: string;
  phone?: string;
  bio?: string;
  profile_picture_url?: string;
  must_change_password: boolean;
  last_login_at?: Date;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Category {
  category_id: string;
  company_id: string;
  name: string;
  icon?: string;
  color_accent?: string;
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CategoryMember {
  category_id: string;
  user_id: string;
}

export interface Task {
  task_id: string;
  company_id: string;
  category_id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  reward_points: number;
  estimated_duration?: string;
  assigned_to?: string;
  status: TaskStatus;
  created_by: string;
  deadline?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface TaskAttachment {
  attachment_id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  created_at?: Date;
}

export interface Notification {
  notification_id: string;
  user_id: string;
  task_id?: string;
  type?: string;
  message: string;
  is_read: boolean;
  created_at?: Date;
}

export interface ActivityLog {
  log_id: string;
  company_id: string;
  user_id?: string;
  action: string;
  details?: any;
  created_at?: Date;
}
