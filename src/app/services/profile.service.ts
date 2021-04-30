import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private userCollection = this.store.collection<User>('Users');
  private profileCollection = this.store.collection('Profiles');

  constructor(private authService: AuthService, private storage: AngularFireStorage, private store: AngularFirestore, private usersService: UsersService) { }

  createProfile(user: User) {
    return this.userCollection.add(user);
  }

  updateProfile(id: string | undefined, pid: string | undefined, user: { name: string, description: string, area: string }) {
    this.profileCollection.doc(pid).update({name: user.name, desc: user.description});
    this.userCollection.doc(id).update({area: user.area});
  }

  getProfile(pid: string | undefined) {
        
    const collection = this.store.collection('Profiles').doc(pid).valueChanges();
    
    return collection
  }

  async deleteProfile(id: string | undefined) {
    const user = await this.authService.getAuth().currentUser;

    const profImgPath = `profile-pictures/${user?.uid}`;
    const wallpImgPath = `wallpaper-pictures/${user?.uid}`;

    try {
      user?.delete();

      this.userCollection.doc(id).delete();

      this.storage.ref(profImgPath).delete();

      this.storage.ref(wallpImgPath).delete();
    } catch (error) {
      console.error(error);
    } finally {
      this.authService.logout();
    }

  }

}
