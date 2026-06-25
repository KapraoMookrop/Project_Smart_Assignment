import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../services/api/auth-api.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './LoginSearchView.html',
})
export class LoginSearchVM implements OnInit {
  loginData = {
    email: '',
    password: '',
  };

  isPasswordVisible: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authApi: AuthApiService,
    private authService: AuthService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

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

      const response = await this.authApi.login({
        username: this.loginData.email,
        password: this.loginData.password,
      });

      if (response.token) {
        // Save session globally
        this.authService.setSession(response.token, response.user);

        this.isLoading = false;
        this.cdr.detectChanges();
        this.notification.success('เข้าสู่ระบบสำเร็จ', 'ยินดีต้อนรับเข้าสู่ระบบ');
        switch (response.user.role) {
          case 'CompanyAdmin':
            this.router.navigate(['/categories']);
            break;
          case 'AppAdmin':
            this.router.navigate(['/companies']);
            break;
          case 'User':
            this.router.navigate(['/dashboard']);
            break;
          default:
            this.router.navigate(['/dashboard']);
            break;
        }
      }
    } catch (err: HttpErrorResponse | any) {
      this.isLoading = false;
      this.cdr.detectChanges();
      this.notification.error('เข้าสู่ระบบล้มเหลว', err.error?.message || err.message || 'กรุณาตรวจสอบข้อมูลอีกครั้ง');
    }
  }
}
