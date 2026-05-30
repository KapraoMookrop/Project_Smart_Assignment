import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyApiService } from '../../services/api/company-api.service';
import { NotificationService } from '../../services/notification.service';
import { Company } from '../../models/app-models';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './CompanyListSearchView.html',
})
export class CompanyListSearchVM implements OnInit {
  companies: Company[] = [];
  searchQuery: string = '';

  constructor(
    private companyApi: CompanyApiService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  async loadCompanies() {
    try {
      console.log('Loading companies...');
      this.companies = await this.companyApi.getCompanies();
      if (this.searchQuery) {
        this.companies = this.companies.filter(c => 
          c.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      this.cdr.detectChanges();
    } catch (error) {
      this.notification.error('โหลดข้อมูลไม่สำเร็จ');
      console.error('Error loading companies:', error);
    }
  }

  async deleteCompany(id: string) {
    const result = await this.notification.confirm('ยืนยันการลบ', `คุณแน่ใจหรือไม่ว่าต้องการลบ Tenant ${id}?`);
    if (result.isConfirmed) {
      try {
        console.log(`Deleting company ${id}...`);
        await this.companyApi.deleteCompany(id);
        this.companies = this.companies.filter(c => c.company_id !== id);
        this.notification.success('ลบสำเร็จ');
        this.cdr.detectChanges();
      } catch (error) {
        this.notification.error('ลบไม่สำเร็จ');
        console.error('Error deleting company:', error);
      }
    }
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
    this.loadCompanies();
  }
}
