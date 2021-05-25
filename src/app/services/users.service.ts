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

  private profileImg: string = "/assets/profile-example.png";
  private wallpImg: string = "/assets/wallpaper-example.jpg";
  
  constructor(private authService: AuthService, private storage: AngularFireStorage, private store: AngularFirestore) { }

  getProfilePicture(pid: string) {
    const filePath = `profiles/${pid}/profile-pictures/profile${pid}`;
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }

  getSearchPic(pid: string){
    const filePath = `profiles/${pid}/profile-pictures/profile${pid}`;
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL().toPromise();
  }

  profasset(){
    return this.profileImg;
  }

  getWallpaper(pid: string) {
    const filePath = `profiles/${pid}/wallpaper-pictures/wallpaper${pid}`;
    const fileRef = this.storage.ref(filePath);
    
    return fileRef.getDownloadURL();
  }

  wallpasset(){
    return this.wallpImg;
  }
  
  getCollection(id: string | undefined) {
    let userObject: {name: string, desc: string, area: string, profileId: string} = { name: "", desc: "", area: "", profileId: ""};
    
    const collection = this.store.collection('Users').doc(id).valueChanges().toPromise();
    
    // collection.subscribe((data: any) => {
    //   userObject.name = data.name;
    //   userObject.desc = data.desc;
    //   userObject.area = data.area;
    //   userObject.profileId = data.profileId;
    // });
    
    return collection;
  }

  getProfile(id: string | undefined) {
    const collection = this.store.collection('Users').doc(id).valueChanges();
    
    return collection;
  }

  async getUid() {
    const user = await this.authService.getAuth().currentUser;

    return user?.uid;
  }

}
