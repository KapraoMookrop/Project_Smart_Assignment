import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserApiService } from '../../services/api/user-api.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../models/app-models';
import { HttpErrorResponse } from '@angular/common/http';
import { DisplayableUrlPipe } from '../../pipes/displayable-url.pipe';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, DisplayableUrlPipe],
  templateUrl: './ProfileEditSearchView.html',
})
export class ProfileEditSearchVM implements OnInit {
  user: User | null = null;
  passwords = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  showPasswordSection: boolean = false;

  constructor(
    private location: Location,
    private userApi: UserApiService,
    private authService: AuthService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.user = JSON.parse(JSON.stringify(this.authService.currentUser()));
    this.cdr.detectChanges();
  }

  goBack() {
    this.location.back();
  }

  togglePasswordSection() {
    this.showPasswordSection = !this.showPasswordSection;
    if (!this.showPasswordSection) {
      this.passwords = { currentPassword: '', newPassword: '', confirmPassword: '' };
    }
  }

  async saveProfile() {
    try {
      if (this.user) {
        // Save profile info
        const updatedUser = await this.userApi.updateProfile(this.user.user_id, this.user);
        
        // Update LocalStorage and Global Signal
        this.authService.updateUserData(updatedUser);
        
        // Refresh local user object with data from server
        this.user = JSON.parse(JSON.stringify(updatedUser));

        // Save password if section is open
        if (this.showPasswordSection) {
          if (!this.passwords.currentPassword || !this.passwords.newPassword) {
            this.notification.warning('กรุณากรอกข้อมูลรหัสผ่านให้ครบถ้วน');
            return;
          }
          if (this.passwords.newPassword !== this.passwords.confirmPassword) {
            this.notification.warning('รหัสผ่านใหม่ไม่ตรงกัน');
            return;
          }
          await this.userApi.changePassword({
            currentPassword: this.passwords.currentPassword,
            newPassword: this.passwords.newPassword
          });
        }

        this.notification.success('สำเร็จ', 'แก้ไขข้อมูลส่วนตัวเรียบร้อยแล้ว');
        this.cdr.detectChanges();
        setTimeout(() => this.goBack(), 1000); 
      }
    } catch (err: HttpErrorResponse | any) {
      this.notification.error('เกิดข้อผิดพลาด', err.error?.message || err.message || 'ไม่สามารถบันทึกข้อมูลได้');
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
}
