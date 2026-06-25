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
  
  constructor(
    private authService: AuthService,
    private authApiService: AuthApiService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
  ) { }

  async ngOnInit() {
    try {
      const result = await this.authApiService.getCurrentUser();
      this.user = result;
      this.cdr.detectChanges();
    } catch (error) {
      this.notification.error('Failed to load user information');
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
