import { Injectable } from '@angular/core';
import { Category, User, ApiResponse, CategorySearchPayload } from '../../models/app-models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {
  private baseUrl = `${environment.apiUrl}/categories`;
  constructor(private readonly http: HttpClient) {}

  async getCategories(payload?: CategorySearchPayload): Promise<Category[]> {
    const observable = this.http.post<ApiResponse<Category[]>>(`${this.baseUrl}/search`, payload || {});
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getCategoriesByCompany(companyId: string, payload?: CategorySearchPayload): Promise<Category[]> {
    const observable = this.http.post<ApiResponse<Category[]>>(`${this.baseUrl}/search/company/${companyId}`, payload || {});
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getCategoryById(categoryId: string): Promise<Category> {
    const observable = this.http.get<ApiResponse<Category>>(`${this.baseUrl}/${categoryId}`);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async saveCategory(category: Partial<Category>): Promise<Category> {
    const observable = this.http.post<ApiResponse<Category>>(`${this.baseUrl}/save`, category);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const observable = this.http.post<ApiResponse<void>>(`${this.baseUrl}/delete/${categoryId}`, {});
    await lastValueFrom(observable);
  }

  async getCategoryMembers(categoryId: string): Promise<User[]> {
    const observable = this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/${categoryId}/members`);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async addMemberToCategory(categoryId: string, userId: string): Promise<void> {
    const observable = this.http.post<ApiResponse<void>>(`${this.baseUrl}/${categoryId}/members/add/${userId}`, {});
    await lastValueFrom(observable);
  }

  async removeMemberFromCategory(categoryId: string, userId: string): Promise<void> {
    const observable = this.http.post<ApiResponse<void>>(`${this.baseUrl}/${categoryId}/members/remove/${userId}`, {});
    await lastValueFrom(observable);
  }
}
