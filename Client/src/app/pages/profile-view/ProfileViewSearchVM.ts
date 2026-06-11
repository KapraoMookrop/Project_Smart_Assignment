import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/app-models';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ProfileViewSearchView.html',
})
export class ProfileViewSearchVM implements OnInit {
  user: User | null = null;
  userStats = {
    completedTasks: 124,
    points: 45200,
    rank: 'Expert'
  };

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.user = this.authService.currentUser();
    this.cdr.detectChanges();
  }
}
