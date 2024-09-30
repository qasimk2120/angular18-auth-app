import { Component, effect, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users.service';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  fb = inject(NonNullableFormBuilder);

  userService = inject(UsersService);
  notificationsService = inject(NotificationService);
  currentUser = this.userService.currentUserProfile;

  profileForm = this.fb.group({
    uid: [''],
    displayName: [''],
    firstName: [''],
    lastName: [''],
    email: [''],
    phone: [''],
    address: [''],
  });

  constructor() {
    effect(() => {
      this.profileForm.patchValue({ ...this.userService.currentUserProfile() });
    });
  }
  async saveProfile() {
    const { uid, ...data } = this.profileForm.value;

    if (!uid) {
      return;
    } else {
      try {
        this.notificationsService.showLoading();
        await this.userService.updateUser({uid, ...data});
        this.notificationsService.success('Profile updated successfully');
      } catch(err:any){
        this.notificationsService.firebaseError(err);
      } finally {
        this.notificationsService.hideloading();
      }
    }
  }
  async uploadFile(event: any){
      const file = event.target.files[0];
      const currentUserId =  this.currentUser()?.['uid'];
      if(!file || !currentUserId){
        return;
      }

      try{
        this.notificationsService.showLoading();
        const photoURL = await this.userService.uploadProfilePhoto(file, `images/profile/${currentUserId}`)
        await this.userService.updateUser({uid: currentUserId, photoURL});
        this.notificationsService.success('Profile photo updated successfully');
      }catch(err:any){
        this.notificationsService.firebaseError(err);
      } finally{
        this.notificationsService.hideloading();
      }
  }
}
