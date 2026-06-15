import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyApiService } from '../../services/api/company-api.service';
import { NotificationService } from '../../services/notification.service';
import { Company, PlanTier } from '../../models/app-models';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-company-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './CompanyEditSearchView.html',
})
export class CompanyEditSearchVM implements OnInit {
  company: Partial<Company> = {
    name: '',
    email: '',
    plan_tier: PlanTier.Starter,
    is_active: true,
    internal_notes: ''
  };
  isEditMode: boolean = false;

  constructor(
    private location: Location,
    private companyApi: CompanyApiService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.loadCompany(id);
    }
  }

  async loadCompany(id: string) {
    try {
      const data = await this.companyApi.getCompanyById(id);
      if (data) {
        this.company = data;
        this.cdr.detectChanges();
      }
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('ไม่พบข้อมูล Tenant', err.error?.message || err.message);
      this.goBack();
    }
  }

  goBack() {
    this.location.back();
  }

  async saveChanges() {
    try {
      if (!this.company.name || !this.company.email) {
        this.notification.warning('กรุณากรอกข้อมูลให้ครบถ้วน', 'ต้องระบุชื่อบริษัทและอีเมลผู้ดูแลระบบ');
        return;
      }

      await this.companyApi.saveCompany(this.company);
      this.notification.success(
        this.isEditMode ? 'บันทึกสำเร็จ' : 'สร้างบริษัทสำเร็จ', 
        this.isEditMode ? 'ข้อมูล Company ถูกอัปเดตเรียบร้อยแล้ว' : 'Company ใหม่ถูกสร้างเรียบร้อยแล้ว'
      );
      this.cdr.detectChanges();
      this.goBack();
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('บันทึกไม่สำเร็จ', err.error?.message || err.message);
    }
  }
}
