import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../../services/api/user-api.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../models/app-models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ProfileEditSearchView.html',
})
export class ProfileEditSearchVM implements OnInit {
  user: User | null = null;

  constructor(
    private location: Location,
    private userApi: UserApiService,
    private authService: AuthService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.user = JSON.parse(JSON.stringify(this.authService.currentUser())); // Deep copy for editing
    this.cdr.detectChanges();
  }

  goBack() {
    this.location.back();
  }

  async saveProfile() {
    try {
      if (this.user) {
        await this.userApi.updateProfile(this.user.user_id, this.user);
        this.notification.success('สำเร็จ', 'แก้ไขข้อมูลส่วนตัวเรียบร้อยแล้ว');
        this.cdr.detectChanges();
        this.goBack();
      }
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('เกิดข้อผิดพลาด', err.error?.message || err.message || 'ไม่สามารถบันทึกข้อมูลได้');
    }
  }

  triggerFileUpload() {
    document.getElementById('profilePicInput')?.click();
  }

  handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Logic สำหรับแสดงรูป Preview หรืออัปโหลด
    }
  }
}
