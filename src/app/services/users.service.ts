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
  
  constructor(private authService: AuthService, private storage: AngularFireStorage, private store: AngularFirestore) {
    this.getId();
  }

  getId(): string | undefined {
    let id;

    this.authService.getAuth().currentUser.then((user) => {
      id = user?.uid
    });

    return id;
  }

  getProfilePicture() {
    const id = this.getId();

    const filePath = `profile-pictures/${id}`;
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }

  profasset(){
    return this.profileImg;
  }

  getWallpaper() {
    const id = this.getId();

    const filePath = `wallpaper-pictures/${id}`;
    const fileRef = this.storage.ref(filePath);
    
    return fileRef.getDownloadURL();
  }

  wallpasset(){
    return this.wallpImg;
  }

  async getCollection() {
    const user = await this.authService.getAuth().currentUser;

    let userObject: {name: string, desc: string} = { name: "", desc: ""};
    
    const collection = this.store.collection('Users').doc(user?.uid).valueChanges();
    
    collection.subscribe((data: any) => {      
      userObject.name = data.name;
      userObject.desc = data.desc;
    });

    return userObject;
  }

  async getArea() {
    const user = await this.authService.getAuth().currentUser;

    let userObject: {area: string} = { area: "" };
    
    const collection = this.store.collection('Users').doc(user?.uid).valueChanges();

    collection.subscribe((data: any) => {
      userObject.area = data.area;
    });

    return userObject;
  }

}
