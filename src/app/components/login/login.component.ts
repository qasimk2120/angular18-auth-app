import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { UsersService } from '../../services/users.service';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIcon
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router);

  authService = inject(AuthService);
  userService = inject(UsersService);
  notificationService = inject(NotificationService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  email = this.loginForm.get('email');
  password = this.loginForm.get('password');

  async login() {
    const { email, password } = this.loginForm.value;
    if (!this.loginForm.valid || !email || !password) {
      return;
    }
    try {
      this.notificationService.showLoading();
      await this.authService.login(email, password);
      this.router.navigate(['/home']);
      this.notificationService.success('Logged in successfully');
    } catch (error: any) {
      this.notificationService.firebaseError(error);
    } finally {
      this.notificationService.hideloading();
    }
  }
  async forgotPassword() {
    const { email } = this.loginForm.value;
    if (!email) {
      this.notificationService.error(
        'Please enter a valid email for resetting password'
      );
      return;
    }
    try {
      this.notificationService.showLoading();
      await this.authService.passwordReset(email);
      this.notificationService.success(
        'Password reset link has been sent to your email'
      );
    } catch (err: any) {
      this.notificationService.firebaseError(err);
    } finally {
      this.notificationService.hideloading();
    }
  }
  async googleSignIn() {
    try {
      this.notificationService.showLoading();
     const newUser =  await this.authService.googleSignIn();
     if(newUser){
      await this.userService.addUser(newUser);
     }
      this.router.navigate(['/home']);
      this.notificationService.success('Logged in successfully');
    } catch (err: any) {
      this.notificationService.firebaseError(err);
    } finally {
      this.notificationService.hideloading();
    }
  }
}
