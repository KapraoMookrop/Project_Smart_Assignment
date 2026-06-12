import { Injectable } from '@angular/core';
import { Company, ApiResponse } from '../../models/app-models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyApiService {
  private baseUrl = `${environment.apiUrl}/companies`;
  constructor(private readonly http: HttpClient) {}

  async getCompanies(): Promise<Company[]> {
    const observable = this.http.get<ApiResponse<Company[]>>(this.baseUrl);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async getCompanyById(companyId: string): Promise<Company> {
    const observable = this.http.get<ApiResponse<Company>>(`${this.baseUrl}/${companyId}`);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async saveCompany(company: Partial<Company>): Promise<Company> {
    const observable = this.http.post<ApiResponse<Company>>(`${this.baseUrl}/save`, company);
    const response = await lastValueFrom(observable);
    return response.data;
  }

  async deleteCompany(companyId: string): Promise<void> {
    const observable = this.http.post<ApiResponse<void>>(`${this.baseUrl}/delete/${companyId}`, {});
    await lastValueFrom(observable);
  }
}
