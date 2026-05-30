import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit(): void {}

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async onLogin() {
    try {
      if (!this.loginData.tenantId || !this.loginData.email || !this.loginData.password) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }

      this.isLoading = true;
      console.log('Logging in with:', this.loginData);

      // โครงสร้างการติดต่อ API ในอนาคต
      // const response = await this.authService.login(this.loginData);
      // if (response.status === 'success') {
      //   // Save JWT and redirect
      //   this.router.navigate(['/dashboard']);
      // }

      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.isLoading = false;
      this.router.navigate(['/dashboard']);

    } catch (error) {
      this.isLoading = false;
      console.error('Login error:', error);
      alert('เข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูลอีกครั้ง');
    }
  }
}
