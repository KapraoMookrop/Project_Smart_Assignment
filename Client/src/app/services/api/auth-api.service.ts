import { Injectable } from '@angular/core';
import { User, UserRole } from '../../models/app-models';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  constructor() {}

  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { 
      token: 'fake-jwt-token-xyz', 
      user: {
        user_id: 'u-001',
        company_id: 'c-001',
        username: 'admin_user',
        email: 'admin@smarttask.com',
        role: UserRole.CompanyAdmin,
        full_name: 'สมชาย มั่นคง',
        must_change_password: false,
        is_active: true,
        profile_picture_url: 'https://i.pravatar.cc/150?u=u-001'
      } as User 
    };
  }

  async getCurrentUser(): Promise<User | null> {
    return {
      user_id: 'u-001',
      company_id: 'c-001',
      username: 'admin_user',
      email: 'admin@smarttask.com',
      role: UserRole.CompanyAdmin,
      full_name: 'สมชาย มั่นคง',
      phone: '081-234-5678',
      bio: 'System Administrator with 10 years experience.',
      must_change_password: false,
      is_active: true,
      profile_picture_url: 'https://i.pravatar.cc/150?u=u-001'
    } as User;
  }

  async logout(): Promise<void> {
    // Skeleton implementation
  }
}
