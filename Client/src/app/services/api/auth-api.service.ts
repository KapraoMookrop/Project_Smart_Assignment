import { Injectable } from '@angular/core';
import { User, UserRole } from '../../models/app-models';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpContext } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private baseUrl = `${environment.apiUrl}/auth`;
  constructor(private readonly http: HttpClient) {}

  async login(request: { username: string; password: string;}): Promise<{ token: string; user: User }> {
    const observable = this.http.post<{ status: string; data: { token: string; user: User }; message: string }>(
      `${this.baseUrl}/login`,
      request,
    );

    const response = await lastValueFrom(observable);
    return response.data;
  }

  async logout(): Promise<void> {
    // Skeleton implementation
  }
}
