import { Injectable } from '@angular/core';
import { User, ApiResponse, UserSearchPayload } from '../../models/app-models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private baseUrl = `${environment.apiUrl}/users`;
  constructor(private readonly http: HttpClient) {}

  async getUsers(payload?: UserSearchPayload): Promise<User[]> {
    const observable = this.http.post<ApiResponse<User[]>>(`${this.baseUrl}/search`, payload || {});
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getUserById(userId: string): Promise<User> {
    const observable = this.http.get<ApiResponse<User>>(`${this.baseUrl}/${userId}`);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getUsersByCategory(categoryId: string, payload?: UserSearchPayload): Promise<User[]> {
    const observable = this.http.post<ApiResponse<User[]>>(`${this.baseUrl}/search/category/${categoryId}`, payload || {});
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getUsersByCompany(companyId: string, payload?: UserSearchPayload): Promise<User[]> {
    const observable = this.http.post<ApiResponse<User[]>>(`${this.baseUrl}/search/company/${companyId}`, payload || {});
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async saveUser(user: Partial<User>): Promise<User> {
    const observable = this.http.post<ApiResponse<User>>(`${this.baseUrl}/save`, user);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    const observable = this.http.post<ApiResponse<void>>(`${this.baseUrl}/delete/${userId}`, {});
    await lastValueFrom(observable);
  }

  async updateProfile(userId: string, profile: Partial<User>): Promise<User> {
    const observable = this.http.post<ApiResponse<User>>(`${this.baseUrl}/profile/update/${userId}`, profile);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async changePassword(passwords: any): Promise<void> {
    const observable = this.http.post<ApiResponse<void>>(`${this.baseUrl}/profile/change-password`, passwords);
    await lastValueFrom(observable);
  }
}
