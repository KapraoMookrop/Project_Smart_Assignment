import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './CompanyListSearchView.html',
})
export class CompanyListSearchVM implements OnInit {
  companies = [
    { id: 'TEN-8492', name: 'Acme Corp X', initial: 'AX', users: 1240, plan: 'Enterprise', status: 'Active' },
    { id: 'TEN-1102', name: 'Global Logistics', initial: 'GL', users: 850, plan: 'Pro', status: 'Active' },
    { id: 'TEN-9931', name: 'Nexus Ventures', initial: 'NX', users: 0, plan: 'Starter', status: 'Inactive' }
  ];

  searchQuery: string = '';

  constructor() {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  async loadCompanies() {
    try {
      console.log('Loading companies...');
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  }

  async deleteCompany(id: string) {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ Tenant ${id}?`)) {
      try {
        console.log(`Deleting company ${id}...`);
        this.companies = this.companies.filter(c => c.id !== id);
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
    this.loadCompanies();
  }
}
