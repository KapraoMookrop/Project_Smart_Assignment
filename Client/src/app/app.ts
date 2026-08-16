import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { AuthService } from './services/auth.service';
import { UserRole } from './models/app-models';
import { App } from '@capacitor/app';
import { Location } from '@angular/common';

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
  UserRole = UserRole; 

  constructor(private location: Location, public router: Router) {}

  ngOnInit() {
    this.handleHardwareBackButton();
  }

  handleHardwareBackButton() {
    App.addListener('backButton', ({ canGoBack }) => {
      const exitRoutes = ['/login', '/dashboard', '/companies', '/categories', '/']; 
      if (exitRoutes.includes(this.router.url)) {
        App.exitApp();
      } else {
        this.location.back();
      }
    });
  }

  get currentRole() {
    return this.authService.currentUser()?.role;
  }
}
