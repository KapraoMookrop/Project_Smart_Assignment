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

  async getCategories(payload?: CategorySearchPayload, skipLoader: boolean = false): Promise<Category[]> {
    const headers: Record<string, string> = skipLoader ? { 'X-Skip-Loader': 'true' } : {};
    const observable = this.http.post<ApiResponse<Category[]>>(`${this.baseUrl}/search`, payload || {}, { headers });
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getCategoriesByCompany(companyId: string, payload?: CategorySearchPayload, skipLoader: boolean = false): Promise<Category[]> {
    const headers: Record<string, string> = skipLoader ? { 'X-Skip-Loader': 'true' } : {};
    const observable = this.http.post<ApiResponse<Category[]>>(`${this.baseUrl}/search/company/${companyId}`, payload || {}, { headers });
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getCategoryById(categoryId: string, skipLoader: boolean = false): Promise<Category> {
    const headers: Record<string, string> = skipLoader ? { 'X-Skip-Loader': 'true' } : {};
    const observable = this.http.get<ApiResponse<Category>>(`${this.baseUrl}/${categoryId}`, { headers });
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

  async getCategoryMembers(categoryId: string, skipLoader: boolean = false): Promise<User[]> {
    const headers: Record<string, string> = skipLoader ? { 'X-Skip-Loader': 'true' } : {};
    const observable = this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/${categoryId}/members`, { headers });
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
