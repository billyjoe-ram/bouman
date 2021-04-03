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
    
  private userId: string | undefined = "";

  private area: string | undefined = "";

  private profileImg: String = "/assets/profile-example.png";
  private wallpImg: String = "/assets/wallpaper-example.jpg";
  
  // private downloadURL!: Observable<string>;
  
  constructor(private authService: AuthService, private storage: AngularFireStorage, private store: AngularFirestore) {
    this.getId();
  }

  async getId() {
    let id;
    const user = await this.authService.getAuth().currentUser;
    this.userId = user?.uid;    
    return this.userId
  }

  getProfilePicture() {
    const filePath = `profile-pictures/${this.userId}`;
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }

  profasset(){
    return this.profileImg;
  }

  getWallpaper() {
    const filePath = `wallpaper-pictures/${this.userId}`;
    const fileRef = this.storage.ref(filePath);
      return fileRef.getDownloadURL();
  }

  wallpasset(){
    return this.wallpImg;
  }

  getCollection() {
    let userObject: {name: string, desc: string} = { name: '', desc: ''};    
    
    const collection = this.store.collection('Users').doc(this.userId).valueChanges();          
    
    collection.subscribe((data: any) => {      
      userObject.name = data.name;
      userObject.desc = data.desc;
    });

    return userObject;
  }

  getArea(): string | undefined {
    let area: string;

    const collection = this.store.collection('Users').doc(this.userId).valueChanges();

    collection.subscribe((data: any) => {

      this.area = data.area;
    });

    return this.area;
  }

}
