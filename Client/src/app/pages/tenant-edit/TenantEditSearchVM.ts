import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyApiService } from '../../services/api/company-api.service';
import { NotificationService } from '../../services/notification.service';
import { Company } from '../../models/app-models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tenant-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './TenantEditSearchView.html',
})
export class TenantEditSearchVM implements OnInit {
  company: Company | null = null;

  constructor(
    private location: Location,
    private companyApi: CompanyApiService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCompany(id);
    }
  }

  async loadCompany(id: string) {
    try {
      this.company = await this.companyApi.getCompanyById(id);
      this.cdr.detectChanges();
    } catch (error) {
      this.notification.error('ไม่พบข้อมูล Tenant');
    }
  }

  goBack() {
    this.location.back();
  }

  async saveChanges() {
    try {
      if (this.company) {
        console.log('Saving company changes:', this.company);
        await this.companyApi.saveCompany(this.company);
        this.notification.success('บันทึกสำเร็จ', 'ข้อมูล Tenant ถูกอัปเดตเรียบร้อยแล้ว');
        this.cdr.detectChanges();
        this.goBack();
      }
    } catch (error) {
      this.notification.error('บันทึกไม่สำเร็จ');
      console.error('Error saving company:', error);
    }
  }
}
