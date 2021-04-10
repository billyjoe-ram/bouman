import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private UserCollection = this.store.collection<User>('Users');

  constructor(private authService: AuthService, private storage: AngularFireStorage, private store: AngularFirestore) { }

  createProfile(user: User) {
    return this.UserCollection.add(user);
  }

  updateProfile(id: string | undefined, user: { name: string, description: string, area: string }) {
    return this.UserCollection.doc(id).update({name: user.name, desc: user.description, area: user.area});
  }

  async deleteProfile(id: string | undefined) {
    const user = await this.authService.getAuth().currentUser;

    const profImgPath = `profile-pictures/${user?.uid}`;
    const wallpImgPath = `wallpaper-pictures/${user?.uid}`;

    try {
      user?.delete();

      this.UserCollection.doc(id).delete();

      this.storage.ref(profImgPath).delete();

      this.storage.ref(wallpImgPath).delete();
    } catch (error) {
      console.error(error);
    } finally {
      this.authService.logout();
    }

  }


}
