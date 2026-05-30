import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../../services/api/user-api.service';
import { AuthApiService } from '../../services/api/auth-api.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../models/app-models';

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
    private authApi: AuthApiService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.user = await this.authApi.getCurrentUser();
    this.cdr.detectChanges();
  }

  goBack() {
    this.location.back();
  }

  async saveProfile() {
    try {
      if (this.user) {
        console.log('Saving profile:', this.user);
        await this.userApi.updateProfile(this.user.user_id, this.user);
        this.notification.success('สำเร็จ', 'แก้ไขข้อมูลส่วนตัวเรียบร้อยแล้ว');
        this.cdr.detectChanges();
        this.goBack();
      }
    } catch (error) {
      this.notification.error('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
      console.error('Error saving profile:', error);
    }
  }

  triggerFileUpload() {
    document.getElementById('profilePicInput')?.click();
  }

  handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Profile picture selected:', file);
      // Logic สำหรับแสดงรูป Preview หรืออัปโหลด
    }
  }
}
