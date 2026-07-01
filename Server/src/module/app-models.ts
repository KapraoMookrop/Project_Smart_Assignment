export enum PlanTier {
  Starter = 'Starter',
  Pro = 'Pro',
  Enterprise = 'Enterprise'
}

export enum UserRole {
  CompanyAdmin = 'CompanyAdmin',
  User = 'User',
  AppAdmin = 'AppAdmin'
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
  email?: string;
  plan_tier: PlanTier;
  is_active: boolean;
  internal_notes?: string;
  created_at?: Date;
  updated_at?: Date;
  employees_count?: number;
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
  category_id: string;
  category_name?: string;
  company_name?: string;
  completed_tasks?: number;
  in_progress_tasks?: number;
  created_tasks?: number;
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
  category_name?: string;
  title: string;
  description?: string;
  priority: TaskPriority;
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


export class ApiResponse<T = any> {
  status: "success" | "error";
  data: T | null;
  message: string;

  constructor(status: "success" | "error", data: T | null, message: string) {
    this.status = status;
    this.data = data;
    this.message = message;
  }

  static success<T>(data: T, message: string = "Success"): ApiResponse<T> {
    return new ApiResponse("success", data, message);
  }

  static error(message: string = "Error", data: any = null): ApiResponse<null> {
    return new ApiResponse("error", data, message);
  }
}

export interface CategorySearchPayload {
  keyword?: string;
}

export interface CompanySearchPayload {
  keyword?: string;
}

export interface UserSearchPayload {
  keyword?: string;
  is_from_member?: boolean;
}
