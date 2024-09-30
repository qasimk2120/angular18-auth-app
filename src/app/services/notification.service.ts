import { inject, Injectable, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getFirebaseErrorMessage } from '../utlities/auth.errors';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  snackbar = inject(MatSnackBar);
  loading = signal<boolean>(false);

  showLoading() {
    this.loading.set(true);
  }
  hideloading() {
    this.loading.set(false);
  }
  success(message: string) {
    this.snackbar.open(message, undefined, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  error(message: string) {
    this.snackbar.open(message, 'Close', {
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  firebaseError(err: FirebaseError){
    this.error(getFirebaseErrorMessage(err));
  }
}
