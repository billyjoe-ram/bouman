import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  private profileImg: any = "/assets/profile-example.jpg";
  private wallpImg: any = "/assets/wallpaper-example.jpg";  
  
  constructor(private authService: AuthService, private storage: AngularFireStorage) { }

  async getId() {
    const user = await this.authService.getAuth().currentUser;    
    return user?.uid;
  }

  getProfilePicture() {
    const filePath = `profile-pictures/${this.getId()}`;
    const fileRef = this.storage.ref(filePath);
    fileRef.getDownloadURL().subscribe(url => {
      if (url !== undefined) {
        return url;
      } else {
        return this.profileImg;
      }
      
    });
  }

  getWallpaper() {    
    const filePath = `wallpaper-pictures/${this.getId()}`;
    const fileRef = this.storage.ref(filePath);
    fileRef.getDownloadURL().subscribe(url => {
      if (url !== undefined ){
        return url;
      } else {
        return this.wallpImg;
      }
      
    });
  }

}
