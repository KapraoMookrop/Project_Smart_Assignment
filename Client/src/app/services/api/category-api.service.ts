import { Injectable } from '@angular/core';
import { Category, User } from '../../models/app-models';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {
  constructor() {}

  async getCategories(): Promise<Category[]> {
    return [
      { category_id: 'cat-001', company_id: 'c-001', name: 'Engineering', icon: 'bi-gear', color_accent: '#00F2FF' },
      { category_id: 'cat-002', company_id: 'c-001', name: 'Marketing', icon: 'bi-megaphone', color_accent: '#06D6A0' },
      { category_id: 'cat-003', company_id: 'c-001', name: 'Sales', icon: 'bi-cart', color_accent: '#FFB703' },
      { category_id: 'cat-004', company_id: 'c-001', name: 'IT Support', icon: 'bi-headset', color_accent: '#00daf3' }
    ];
  }

  async getCategoryById(categoryId: string): Promise<Category | null> {
    return { category_id: categoryId, company_id: 'c-001', name: 'Mock Category', icon: 'bi-star', color_accent: '#FFFFFF' };
  }

  async saveCategory(category: Partial<Category>): Promise<Category> {
    // Skeleton implementation
    return category as Category;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    // Skeleton implementation
  }

  async getCategoryMembers(categoryId: string): Promise<User[]> {
    return [
      { user_id: 'u-002', company_id: 'c-001', full_name: 'Elena Rodriguez', role: 'User', profile_picture_url: 'https://i.pravatar.cc/150?u=u-002' },
      { user_id: 'u-003', company_id: 'c-001', full_name: 'Marcus Chen', role: 'User', profile_picture_url: 'https://i.pravatar.cc/150?u=u-003' }
    ] as User[];
  }

  async addMemberToCategory(categoryId: string, userId: string): Promise<void> {
    // Skeleton implementation
  }

  async removeMemberFromCategory(categoryId: string, userId: string): Promise<void> {
    // Skeleton implementation
  }
}
