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

  private followAction: string = "";

  private userProfileId: string = "";

  private userCollection = this.store.collection<User>('Users');
  private profileCollection = this.store.collection('Profiles');

  constructor(private authService: AuthService, private storage: AngularFireStorage, private store: AngularFirestore, private usersService: UsersService) { }

  createProfile(user: User) {
    return this.userCollection.add(user);
  }

  updateProfile(id: string | undefined, profileId: string | undefined, user: { name: string, description: string, area?: string, subarea?: string }) {
    this.profileCollection.doc(profileId).update({ name: user.name, desc: user.description });
    if (user.area) {
      this.userCollection.doc(id).update({ area: user.area, subarea: user.subarea });
    };
  }

  getProfile(profileId: string | undefined) {
    const collection = this.store.collection('Profiles').doc(profileId).valueChanges();

    return collection;
  }

  getProfilePromise(profileId: string | undefined) {
    const collection = this.store.collection('Profiles').doc(profileId).ref.get();

    return collection;
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

  followProfile(profileId: string, followingProfiles: string[], userProfile: string) {
    const profileFollowing = this.profileCollection.doc(userProfile);

    if (this.followAction === "Seguindo") {
      followingProfiles = followingProfiles.filter(profile => {
        return profile !== profileId;
      })

      return profileFollowing.update({ following: followingProfiles });
    } else {
      followingProfiles.push(profileId);

      return profileFollowing.update({ following: followingProfiles });
    }

  }

  verifyFollowing(profileId: string, following: string[]): string {

    if (following.includes(profileId)) {
      this.followAction = "Seguindo";
    } else {
      this.followAction = "Seguir";
    }

    return this.followAction;
  }

  updateContact(profileId: string, contact: { email: string, linkedin: string, other: string }) {
    return this.profileCollection.doc(profileId).update({ social: contact });
  }

}
