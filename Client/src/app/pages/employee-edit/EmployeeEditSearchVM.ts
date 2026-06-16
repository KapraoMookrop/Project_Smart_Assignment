import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../../services/api/user-api.service';
import { NotificationService } from '../../services/notification.service';
import { User, UserRole } from '../../models/app-models';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DisplayableUrlPipe } from '../../pipes/displayable-url.pipe';
import { getDisplayableUrl } from '../../utils/url-helper';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, DisplayableUrlPipe],
  templateUrl: './EmployeeEditSearchView.html',
})
export class EmployeeEditSearchVM implements OnInit {
  user: Partial<User> = {
    full_name: '',
    email: '',
    username: '',
    role: UserRole.User,
    is_active: true
  };
  isEditMode: boolean = false;
  password: string = ''; // For new user

  roles = [
    { value: UserRole.User, label: 'พนักงานทั่วไป (Standard User)' },
    { value: UserRole.CompanyAdmin, label: 'ผู้ดูแลระบบ (Company Admin)' }
  ];

  constructor(
    private location: Location,
    private userApi: UserApiService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.loadUser(id);
    }
  }

  async loadUser(id: string) {
    try {
      const data = await this.userApi.getUserById(id);
      if (data) {
        this.user = data;
        this.cdr.detectChanges();
      }
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('ไม่พบข้อมูลสมาชิก', err.error?.message || err.message);
      this.goBack();
    }
  }

  goBack() {
    this.location.back();
  }

  async saveUser() {
    try {
      if (!this.user.full_name || !this.user.email || (!this.isEditMode && !this.password)) {
        this.notification.warning('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }

      const userData = { ...this.user };
      if (!this.isEditMode) {
        (userData as any).password = this.password;
      }

      await this.userApi.saveUser(userData);
      this.notification.success(
        this.isEditMode ? 'อัปเดตสำเร็จ' : 'สร้างสำเร็จ', 
        `สมาชิก "${this.user.full_name}" ถูกบันทึกเรียบร้อยแล้ว`
      );
      this.cdr.detectChanges();
      this.goBack();
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('บันทึกไม่สำเร็จ', err.error?.message || err.message);
    }
  }

  showDriveInfo() {
    this.notification.info(
      'วิธีแชร์รูปจาก Google Drive',
      `1. อัปโหลดรูปไปที่ Google Drive\n` +
      `2. คลิกขวาที่รูป เลือก "แชร์" (Share)\n` +
      `3. ปรับการเข้าถึงเป็น "ทุกคนที่มีลิงค์" (Anyone with the link)\n` +
      `4. คัดลอกลิงค์มาวางในช่อง URL รูปโปรไฟล์`,
      'ตกลง'
    );
  }

  getDisplayableUrl(url: string | undefined): string {
    return getDisplayableUrl(url);
  }
}
