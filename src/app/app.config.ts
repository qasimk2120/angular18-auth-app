import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {getFirestore, provideFirestore } from '@angular/fire/firestore';
import {getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment.development';
 let firebaseConfig = 
  {
    projectId: environment.firebaseConfig.projectId,
    appId: environment.firebaseConfig.appId,
    storageBucket: environment.firebaseConfig.storageBucket,
    apiKey: environment.firebaseConfig.apiKey, 
    authDomain: environment.firebaseConfig.authDomain, //
    messagingSenderId: environment.firebaseConfig.messagingSenderId
  }

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp(firebaseConfig)
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    MatSnackBarModule
  ],
};
