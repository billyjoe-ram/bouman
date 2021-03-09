import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  public profileImg: any = "/assets/profile-example.png";
  public wallpImg: any = "/assets/wallpaper-example.jpg";
  private userId: string | undefined = "";
  
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
    let picUrl;

    fileRef.getDownloadURL().subscribe(async url => {
      picUrl = await url;
    });
    
    if (picUrl != undefined) {
      return picUrl;
    } else {
      return this.profileImg;
    }
    
  }

  getWallpaper() {
    const filePath = `wallpaper-pictures/${this.userId}`;
    const fileRef = this.storage.ref(filePath);
    let picWlpp;

    fileRef.getDownloadURL().subscribe(async url => {
      picWlpp = await url;
    }); 
    
    if (picWlpp != undefined) {
      return picWlpp;
    } else {
      return this.wallpImg;
    }
  }

  async getCollection() {
    let userObject: {name: string, desc: string} = { name: '', desc: ''};
    let collection;
    try {
      collection = await this.store.collection('Users').doc(this.userId).valueChanges();      
    } catch (error) {
      console.error(error);        
    }
    
    collection?.subscribe((data: any) => {
      // console.log(data);      
      userObject.name = data.name;
      userObject.desc = data.desc;
    });

    return userObject;
  }

}
