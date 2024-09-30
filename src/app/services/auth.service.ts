import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  UserCredential,
  UserProfile,
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);

  currentUser$ = authState(this.firebaseAuth);
  currentUser = toSignal<User | null>(this.currentUser$);
  googlProvider = new GoogleAuthProvider();
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.firebaseAuth, email, password);
  }
  signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.firebaseAuth, email, password);
  }
  setDisplayName(user: User, name: string): Promise<void> {
    return updateProfile(user, { displayName: name });
  }

  passwordReset(email: string): Promise<void> {
    return sendPasswordResetEmail(this.firebaseAuth, email);
  }

  async googleSignIn(): Promise<UserProfile | null> {
    const userCredential = await signInWithPopup(
      this.firebaseAuth,
      this.googlProvider
    );
    const additionalInfo = getAdditionalUserInfo(userCredential);
    
    if (!additionalInfo?.isNewUser) {
      return Promise.resolve(null);
    }
    const {
      user: { displayName, uid, photoURL, email },
    } = userCredential;

    const newProfile = {
      displayName: displayName ?? '',
      uid: uid,
      photoURL: photoURL ,
      email: email,
    };
    console.log(newProfile);
    return Promise.resolve(newProfile);
  }

  logout() {
    return signOut(this.firebaseAuth);
  }
}
