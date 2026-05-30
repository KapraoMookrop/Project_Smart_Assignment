import { Injectable } from '@angular/core';
import { Company, PlanTier } from '../../models/app-models';

@Injectable({
  providedIn: 'root'
})
export class CompanyApiService {
  constructor() {}

  async getCompanies(): Promise<Company[]> {
    return [
      { company_id: 'c-001', name: 'Acme Corp Global', plan_tier: PlanTier.Enterprise, is_active: true },
      { company_id: 'c-002', name: 'Global Logistics', plan_tier: PlanTier.Pro, is_active: true },
      { company_id: 'c-003', name: 'Nexus Ventures', plan_tier: PlanTier.Starter, is_active: false }
    ];
  }

  async getCompanyById(companyId: string): Promise<Company | null> {
    return { 
      company_id: companyId, 
      name: 'Acme Corp Global', 
      email: 'admin@acmecorp.com',
      plan_tier: PlanTier.Enterprise, 
      is_active: true,
      internal_notes: 'Enterprise tier client. Requires strict SLA compliance tracking.'
    };
  }

  async saveCompany(company: Partial<Company>): Promise<Company> {
    // Skeleton implementation
    return company as Company;
  }

  async deleteCompany(companyId: string): Promise<void> {
    // Skeleton implementation
  }
}
