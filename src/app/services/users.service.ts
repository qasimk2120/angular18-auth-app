import { inject, Injectable } from '@angular/core';
import { UserProfile } from '@angular/fire/auth';
import { collection, doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

    fireStore = inject(Firestore)
    authService = inject(AuthService)
    storage =  inject(Storage)

    private currentUserProfile$: Observable<UserProfile | null> = this.authService.currentUser$.pipe(
      switchMap((user:any)=>{
        if(!user){
          return of(null);
        }
          const ref = doc(this.fireStore, `users/${user['uid']}`);
          return docData(ref) as Observable<UserProfile>;
      })
    )
  addUser(user:UserProfile): Promise<void> {
    const ref = doc(this.fireStore, `users/${user['uid']}`);
    return setDoc(ref, user);
  }
  currentUserProfile = toSignal(this.currentUserProfile$)

  updateUser(user: UserProfile){
    const ref = doc(this.fireStore, `users/${user['uid']}`);
    return updateDoc(ref, {...user});
  }
  async uploadProfilePhoto(image: File, path: string): Promise<string>{
    const storageRef =  ref(this.storage, path);
    const result  = await uploadBytes(storageRef, image)
    return await getDownloadURL(result.ref)
  }
}

