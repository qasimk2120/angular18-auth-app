import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule ,Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { passwordsMathValidators } from '../../utlities/password-validator';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { UsersService } from '../../services/users.service';
import { MatIcon } from '@angular/material/icon';




@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatIcon
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {

  fb = inject(FormBuilder);
  router = inject(Router)

  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  usersService = inject(UsersService);


  signUpForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  } ,
  {validators: passwordsMathValidators()}
);
  name = this.signUpForm.get('name');
  email = this.signUpForm.get('email');
  password = this.signUpForm.get('password');
  confirmPassword = this.signUpForm.get('confirmPassword');

  


  async signUp(){
    const {name, email, password} = this.signUpForm.value;
    if(!this.signUpForm.valid || !name || !email || !password){
      return
    }

    try{
      this.notificationService.showLoading();
      const {user: {uid}} = await this.authService.signUp( email, password);
      await this.usersService.addUser({uid, email, displayName:name });
      this.notificationService.success('User was successfully signed up');
      this.router.navigate(['/home']);
    }catch(error:any){
      this.notificationService.firebaseError(error)
    }finally {
      this.notificationService.hideloading();
    }

  }
  async googleSignIn() {
    try {
      this.notificationService.showLoading();
     const newUser =  await this.authService.googleSignIn();
     if(newUser){
      await this.usersService.addUser(newUser);
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
