import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ProfileViewSearchView.html',
})
export class ProfileViewSearchVM implements OnInit {
  user = {
    fullName: 'Admin User',
    email: 'admin@globalenterprise.com',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced system administrator focusing on multi-tenant architecture and security.',
    role: 'Super Admin',
    company: 'Global Enterprise',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuK4KYaL1u0NVN0GNo8u5AagWDphT9yUo1mcR8qEq8TE3sJUfagMnLZtgflaM2vaRfkIGsS9wUb7RhHr4RY3Z0esH4GxqTpFbzfdVM4Bu60MPpXdHmisJ9OIQ8ZqyOn_yKcLWOvXTTUoAVnhGY5CuumC-cWQlfrgi6NPGTK1yuaITH1TFBHMbZerDldGCPi0Elf4W8Pcv15jEgRa2RwtZfmn22v4hbrcp8InWS-DhESi9U23cHQTf5AUUEWY7JvxvFSe3lcxs6em-Ws',
    completedTasks: 124,
    points: 45200,
    rank: 'Expert'
  };

  constructor() {}

  ngOnInit(): void {}
}
