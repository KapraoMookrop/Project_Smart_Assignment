import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyApiService } from '../../services/api/company-api.service';
import { NotificationService } from '../../services/notification.service';
import { Company } from '../../models/app-models';
import { HttpErrorResponse } from '@angular/common/http';

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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  async loadCompanies() {
    try {
      this.companies = await this.companyApi.getCompanies();
      if (this.searchQuery) {
        this.companies = this.companies.filter(c =>
          c.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      this.cdr.detectChanges();
    } catch (error: HttpErrorResponse | any) {
      this.notification.error('โหลดข้อมูลไม่สำเร็จ', error.message);
    }
  }

  async deleteCompany(id: string) {
    const result = await this.notification.confirm('ยืนยันการลบ', `คุณแน่ใจหรือไม่ว่าต้องการลบ Tenant ${id}?`);
    if (result.isConfirmed) {
      try {
        await this.companyApi.deleteCompany(id);
        this.companies = this.companies.filter(c => c.company_id !== id);
        this.notification.success('ลบสำเร็จ');
        this.cdr.detectChanges();
      } catch (err: HttpErrorResponse | any) {
        this.notification.error('ลบไม่สำเร็จ', err.message);
      }
    }
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
    this.loadCompanies();
  }

  editCompany(id: string) {
    this.router.navigate(['/companies/edit', id]);
  }
}
