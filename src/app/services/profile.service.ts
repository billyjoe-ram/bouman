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

  async followProfile(profileId: string | undefined) {
    // Getting current user uid
    const user = await this.authService.getAuth().currentUser;
    
    // Getting current user profileId
    this.usersService.getProfile(user?.uid).subscribe((profile: any) => {      

      this.userProfileId = profile.profileId;

      // Getting current user following array
      const updateProfile = this.getProfile(this.userProfileId).subscribe((profile: any) => {
        // Creating a copy from this array        
        const profilesFollowing: any[] = profile.following
        
        // Checking if already followed
        if (!profilesFollowing.includes(profileId)) {
          // Adding profileToFollow to array
          profilesFollowing.push(profileId);

          // Replacing with copy
          this.profileCollection.doc(this.userProfileId).update({ following: profilesFollowing });
          console.log("Followed!");
        } else {
          console.log("Already in array: ");
          console.log(profilesFollowing);
        }
        
      });
      
    });

  }

  async verifyFollowing(profileId: string | undefined) {
    // Getting current user uid
    const user = await this.authService.getAuth().currentUser;

    this.usersService.getProfile(user?.uid).subscribe((profile: any) => {      
      this.userProfileId = profile.profileId;

      // Getting current user following array
      const updateProfile = this.getProfile(this.userProfileId).subscribe((profile: any) => {
        // Creating a copy from this array        
        const profilesFollowing: any[] = profile.following
        
        // Checking if already followed
        if (profilesFollowing.includes(profileId)) {
          this.followAction = "Seguindo";
        } else {
          this.followAction = "Seguir";
        }
        
      });
    })

  }

  updateContact(profileId: string, contact: { email: string, linkedin: string, other: string }) {
    return this.profileCollection.doc(profileId).update({ social: contact });
  }

}
