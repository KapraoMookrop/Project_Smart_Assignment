import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../../services/api/user-api.service';
import { NotificationService } from '../../services/notification.service';
import { User, UserRole } from '../../models/app-models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    { value: UserRole.User, label: 'Standard User' },
    { value: UserRole.CompanyAdmin, label: 'Company Administrator' }
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
    } catch (error) {
      this.notification.error('ไม่พบข้อมูลสมาชิก');
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
        // In real app, we might need a specific "create user" endpoint or handle it in saveUser
      }

      console.log('Saving user:', userData);
      await this.userApi.saveUser(userData);
      this.notification.success(
        this.isEditMode ? 'อัปเดตสำเร็จ' : 'สร้างสำเร็จ', 
        `สมาชิก "${this.user.full_name}" ถูกบันทึกเรียบร้อยแล้ว`
      );
      this.cdr.detectChanges();
      this.goBack();
    } catch (error) {
      this.notification.error('บันทึกไม่สำเร็จ');
      console.error('Error saving user:', error);
    }
  }
}
