import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ProfileEditSearchView.html',
})
export class ProfileEditSearchVM implements OnInit {
  user = {
    fullName: 'Admin User',
    email: 'admin@globalenterprise.com',
    phone: '+1 (555) 123-4567',
    bio: '',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuK4KYaL1u0NVN0GNo8u5AagWDphT9yUo1mcR8qEq8TE3sJUfagMnLZtgflaM2vaRfkIGsS9wUb7RhHr4RY3Z0esH4GxqTpFbzfdVM4Bu60MPpXdHmisJ9OIQ8ZqyOn_yKcLWOvXTTUoAVnhGY5CuumC-cWQlfrgi6NPGTK1yuaITH1TFBHMbZerDldGCPi0Elf4W8Pcv15jEgRa2RwtZfmn22v4hbrcp8InWS-DhESi9U23cHQTf5AUUEWY7JvxvFSe3lcxs6em-Ws'
  };

  constructor(private location: Location) {}

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  async saveProfile() {
    try {
      console.log('Saving profile:', this.user);
      // โครงสร้างการติดต่อ API ในอนาคต
      // await this.apiService.updateProfile(this.user);
      alert('แก้ไขข้อมูลส่วนตัวสำเร็จ!');
      this.goBack();
    } catch (error) {
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
