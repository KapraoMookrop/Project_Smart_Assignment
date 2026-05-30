import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../services/api/auth-api.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './LoginSearchView.html',
})
export class LoginSearchVM implements OnInit {
  loginData = {
    tenantId: '',
    email: '',
    password: ''
  };

  isPasswordVisible: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authApi: AuthApiService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.cdr.detectChanges();
  }

  async onLogin() {
    try {
      if (!this.loginData.email || !this.loginData.password) {
        this.notification.warning('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกอีเมลและรหัสผ่าน');
        return;
      }

      this.isLoading = true;
      this.cdr.detectChanges();
      console.log('Logging in with:', this.loginData);

      const response = await this.authApi.login(this.loginData.email, this.loginData.password);
      
      if (response.token) {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.notification.success('เข้าสู่ระบบสำเร็จ', 'ยินดีต้อนรับเข้าสู่ระบบ');
        this.router.navigate(['/dashboard']);
      }

    } catch (error) {
      this.isLoading = false;
      this.cdr.detectChanges();
      this.notification.error('เข้าสู่ระบบล้มเหลว', 'กรุณาตรวจสอบข้อมูลอีกครั้ง');
      console.error('Login error:', error);
    }
  }
}
