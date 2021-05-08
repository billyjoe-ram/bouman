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

  public followAction: string = "";
  
  private userProfileId: string = "";

  private userCollection = this.store.collection<User>('Users');
  private profileCollection = this.store.collection('Profiles');

  constructor(private authService: AuthService, private storage: AngularFireStorage, private store: AngularFirestore, private usersService: UsersService) { }

  createProfile(user: User) {
    return this.userCollection.add(user);
  }

  updateProfile(id: string | undefined, profileId: string | undefined, user: { name: string, description: string, area: string }) {
    this.profileCollection.doc(profileId).update({name: user.name, desc: user.description});
    this.userCollection.doc(id).update({area: user.area});
  }

  getProfile(profileId: string | undefined) {
    const collection = this.store.collection('Profiles').doc(profileId).valueChanges();
    
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

  followProfile(userProfile: string | undefined, profileId: string | undefined) {
    const profileFollowing = this.profileCollection.doc(userProfile).collection('Following');
    
    return profileFollowing.add({ profileId });
  }

  verifyFollowing(userProfile: string | undefined, profileId: string | undefined) {
    console.log(userProfile)

    const profileData = this.usersService.getProfile(userProfile).toPromise();

    profileData.then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error)
    }).finally(() => { console.log("Finally" )});

    // Getting current user following array
    // const updateProfile = this.getProfile(this.userProfileId).subscribe((profile: any) => {
    //   // Creating a copy from this array        
    //   const profilesFollowing: any[] = profile.following
      
    //   // Checking if already followed
    //   if (profilesFollowing.includes(profileId)) {
    //     this.followAction = "Seguindo";
    //   } else {
    //     this.followAction = "Seguir";
    //   }
      
    // });
  }

  updateContact(profileId: string, contact: { email: string, linkedin: string, other: string }) {
    return this.profileCollection.doc(profileId).update({ social: contact });
  }

}
