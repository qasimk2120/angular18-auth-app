import { Component, inject } from '@angular/core';
import { Router, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import {  MatButtonModule } from '@angular/material/button';
import {MatIconModule } from '@angular/material/icon'; 
import {MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from './services/notification.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'firebase-auth-app';

  router = inject(Router)

  authService = inject(AuthService);
  usersService = inject(UsersService)
  notificationService = inject(NotificationService);

  currentUser = this.usersService.currentUserProfile;
  loading = this.notificationService.loading;

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
