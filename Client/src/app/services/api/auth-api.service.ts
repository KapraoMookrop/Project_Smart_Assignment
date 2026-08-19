import { Injectable } from '@angular/core';
import { User, ApiResponse } from '../../models/app-models';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private baseUrl = `${environment.apiUrl}/auth`;
  constructor(private readonly http: HttpClient) {}

  async login(request: { username: string; password: string;}): Promise<{ token: string; user: User }> {
    const observable = this.http.post<ApiResponse<{ token: string; user: User }>>(
      `${this.baseUrl}/login`,
      request,
    );

    const response = await lastValueFrom(observable);
    return response.data;
  }

  async logout(): Promise<void> {
    const observable = this.http.post<ApiResponse<void>>(`${this.baseUrl}/logout`, {});
    await lastValueFrom(observable);
  }

  async getCurrentUser(skipLoader: boolean = false): Promise<User> {
    const headers: Record<string, string> = skipLoader ? { 'X-Skip-Loader': 'true' } : {};
    const observable = this.http.get<ApiResponse<User>>(`${this.baseUrl}/me`, { headers });
    const response = await lastValueFrom(observable);
    return response.data;
  }
}
