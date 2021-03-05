import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {

  private imgPath: string = "";
  public profileImg: any = "/assets/profile-example.png";
  public wallpImg: any = "/assets/wallpaper-example.jpg";

  constructor(private storage: AngularFireStorage, private auth: AuthService) { }
    
  ngOnInit(): void {
  }

  async upload($event: any) {
    this.imgPath = $event.target.files[0];
  }

  async profilePic() {
    const user = await this.auth.getAuth().currentUser;

    const filePath = `profile-pictures/${user?.uid}`;
    const ref = this.storage.upload(filePath, this.imgPath);
    const fileRef = this.storage.ref(filePath);
    fileRef.getDownloadURL().subscribe(url => {
      this.profileImg = url;
    });    
  }

  async wallpaPic() {
    const user = await this.auth.getAuth().currentUser;
        
    const filePath = `wallpaper-pictures/${user?.uid}`;
    const ref = this.storage.upload(filePath, this.imgPath);
    const fileRef = this.storage.ref(filePath);
    fileRef.getDownloadURL().subscribe(url => {
      this.wallpImg = url;
    });    
  }

}
