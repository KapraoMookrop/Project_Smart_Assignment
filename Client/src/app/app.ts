import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { AuthService } from './services/auth.service';
import { UserRole } from './models/app-models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'Task-Assignment';
  loadingService = inject(LoadingService);
  authService = inject(AuthService);
  loading$ = this.loadingService.loading$;
  UserRole = UserRole; // Expose enum for template

  constructor(public router: Router) {}

  get currentRole() {
    return this.authService.currentUser()?.role;
  }
}
