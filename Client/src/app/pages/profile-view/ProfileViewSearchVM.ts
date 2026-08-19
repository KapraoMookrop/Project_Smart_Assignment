import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/app-models';
import { DisplayableUrlPipe } from '../../pipes/displayable-url.pipe';
import { AuthApiService } from '../../services/api/auth-api.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterModule, DisplayableUrlPipe],
  templateUrl: './ProfileViewSearchView.html',
})
export class ProfileViewSearchVM implements OnInit {
  user: User | null = null;
  isLoading = false;

  dummyUser: User = {
    user_id: 'loading-id',
    username: 'loading',
    full_name: 'กำลังโหลดข้อมูล...',
    role: 'User',
    company_name: 'กำลังโหลดบริษัท...',
    category_name: 'กำลังโหลดแผนก...',
    profile_picture_url: '',
    email: 'กำลังโหลด...',
    phone: 'กำลังโหลด...',
    bio: 'ประวัติแนะนำตัวย่อกำลังถูกโหลดเพื่อแสดงรายละเอียดส่วนตัว',
    completed_tasks: 0,
    in_progress_tasks: 0,
    created_tasks: 0
  } as any;
  
  constructor(
    private authService: AuthService,
    private authApiService: AuthApiService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
  ) { }

  async ngOnInit() {
    this.isLoading = true;
    this.user = this.dummyUser;
    this.cdr.detectChanges();
    try {
      const result = await this.authApiService.getCurrentUser(true);
      this.user = result;
      this.cdr.detectChanges();
    } catch (error) {
      this.notification.error('Failed to load user information');
      this.user = null;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async loadCurrentUser() {
    this.user = this.authService.currentUser();
    this.cdr.detectChanges();
  }

  logout() {
    this.authService.logout();
  }
}
