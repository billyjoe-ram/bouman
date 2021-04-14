import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {      

  private area: string | undefined = "";

  private profileImg: String = "/assets/profile-example.png";
  private wallpImg: String = "/assets/wallpaper-example.jpg";
  
  constructor(private authService: AuthService, private storage: AngularFireStorage, private store: AngularFirestore) { }

  async getProfilePicture() {
    const user = await this.authService.getAuth().currentUser;

    const filePath = `profile-pictures/${user?.uid}`;
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }

  profasset(){
    return this.profileImg;
  }

  async getWallpaper() {
    const user = await this.authService.getAuth().currentUser;

    const filePath = `wallpaper-pictures/${user?.uid}`;
    const fileRef = this.storage.ref(filePath);
    
    return fileRef.getDownloadURL();
  }

  wallpasset(){
    return this.wallpImg;
  }

  
  getCollection(id: string | undefined) {
    let userObject: {name: string, desc: string, area: string, profileId: string} = { name: "", desc: "", area: "", profileId: ""};
    
    const collection = this.store.collection('Users').doc(id).valueChanges();
    
    collection.subscribe((data: any) => {
      userObject = data;
    });

    return userObject;
  }

}
