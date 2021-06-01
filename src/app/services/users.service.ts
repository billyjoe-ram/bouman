import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
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

  getSearchPic(pid: string) {
    const filePath = `profiles/${pid}/profile-pictures/profile${pid}`;
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL().toPromise();
  }

  profasset() {
    return this.profileImg;
  }

  getWallpaper(pid: string) {
    const filePath = `profiles/${pid}/wallpaper-pictures/wallpaper${pid}`;
    const fileRef = this.storage.ref(filePath);

    return fileRef.getDownloadURL();
  }

  wallpasset() {
    return this.wallpImg;
  }

  async checkusercompany(uid: string | undefined) {
    let check = this.store.collection('Users').doc(uid).ref.get().then((datauser) => {
      if (datauser.data() == undefined) {
        return 'Companies';
      } else {
        return 'Users';
      }
    });
    return check;
  }

  async checkusercompanyprofile(id: string | undefined) {
    let check = this.store.collection('Profiles').doc(id).ref.get().then((data: any) => {
      let teste = data.data();
      if (teste.cnpj != undefined || teste.cnpj != null) {
        return teste.cnpj
      }
      else {
        return undefined;
      }
    });
    return check;
  }

  getCollection(id: string | undefined) {
    const collection = this.store.collection('Users').doc(id).ref.get();

    return collection;
  }

  getCompany(id: string | undefined) {

    const collection = this.store.collection('Companies').doc(id).ref.get();

    return collection;
  }

  getProfile(uid: string | undefined) {
    return this.authService.getAuth().currentUser.then((user: any) => {
      return this.checkusercompany(user.uid).then((res) => {
        const collection = this.store.collection(res).doc(uid).valueChanges();
        return collection;
      });
    });
  }

  async getUid() {
    const user = await this.authService.getAuth().currentUser;

    return user?.uid;
  }

}
