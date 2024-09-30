import { FirebaseError } from '@angular/fire/app';

export const getFirebaseErrorMessage = ({ code }: FirebaseError): string => {
  let message;

  switch (code) {
    case 'auth/invalid-credential':
      message = 'Entered email address or password is invalid';
      break;
    case 'auth/email-already-in-use':
        message = 'User Already Exists';
      break;
    default:
      message =
        'An unspecified error occurred. Please contact the administrator';
      break;
  }
  return message;
};
