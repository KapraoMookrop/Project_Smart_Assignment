import { Injectable } from '@angular/core';
import { User, ApiResponse } from '../../models/app-models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private baseUrl = `${environment.apiUrl}/users`;
  constructor(private readonly http: HttpClient) {}

  async getUsers(): Promise<User[]> {
    const observable = this.http.get<ApiResponse<User[]>>(this.baseUrl);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getUserById(userId: string): Promise<User> {
    const observable = this.http.get<ApiResponse<User>>(`${this.baseUrl}/${userId}`);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getUsersByCategory(categoryId: string): Promise<User[]> {
    const observable = this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/category/${categoryId}`);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getUsersByCompany(companyId: string): Promise<User[]> {
    const observable = this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/company/${companyId}`);
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
}
