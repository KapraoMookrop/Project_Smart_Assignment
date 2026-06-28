import { Injectable } from '@angular/core';
import { Task, TaskAttachment, ApiResponse } from '../../models/app-models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  private baseUrl = `${environment.apiUrl}/tasks`;
  constructor(private readonly http: HttpClient) {}

  async getTasks(filters?: { categoryId?: string, createdBy?: string, assignedTo?: string }): Promise<Task[]> {
    let url = this.baseUrl;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.createdBy) params.append('createdBy', filters.createdBy);
      if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
      url += `?${params.toString()}`;
    }
    const observable = this.http.get<ApiResponse<Task[]>>(url);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getUserTaskStats(userId: string): Promise<{ inProgress: number, completed: number }> {
    const observable = this.http.get<ApiResponse<{ inProgress: number, completed: number }>>(`${this.baseUrl}/user/${userId}/stats`);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getTaskById(taskId: string): Promise<Task> {
    const observable = this.http.get<ApiResponse<Task>>(`${this.baseUrl}/${taskId}`);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    const observable = this.http.post<ApiResponse<Task>>(`${this.baseUrl}/save`, task);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async updateTask(taskId: string, task: Partial<Task>): Promise<Task> {
    const observable = this.http.post<ApiResponse<Task>>(`${this.baseUrl}/update/${taskId}`, task);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async deleteTask(taskId: string): Promise<void> {
    const observable = this.http.post<ApiResponse<void>>(`${this.baseUrl}/delete/${taskId}`, {});
    await lastValueFrom(observable);
  }

  async claimTask(taskId: string): Promise<Task> {
    const observable = this.http.post<ApiResponse<Task>>(`${this.baseUrl}/${taskId}/claim`, {});
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getAttachments(taskId: string): Promise<TaskAttachment[]> {
    const observable = this.http.get<ApiResponse<TaskAttachment[]>>(`${this.baseUrl}/${taskId}/attachments`);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async addAttachment(taskId: string, attachment: Partial<TaskAttachment>): Promise<TaskAttachment> {
    const observable = this.http.post<ApiResponse<TaskAttachment>>(`${this.baseUrl}/${taskId}/attachments`, attachment);
    const response = await lastValueFrom(observable);
    return response.data;
  }
}
