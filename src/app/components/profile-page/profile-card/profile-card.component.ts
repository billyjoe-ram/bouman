import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit, OnDestroy {  
  
  public esconder: boolean = false;

  public userData: {name: string, desc: string} = { name: '', desc: ''};

  public profileImg: any = "";  
  public wallpImg: any = "";
  
  private imgPath: any = "";
  private backgroundPath: any = "";  

  private profile!: Subscription;
  private wallpaper!: Subscription;  

  constructor(
    private storage: AngularFireStorage, 
    private auth: AuthService,    
    private user: UsersService) { }
    
  ngOnInit(): void {
    this.user.getCollection().then(data => {
      this.userData.name = data.name;
      this.userData.desc = data.desc;
    });

    // usando o service de usuario para pegar as imagens
    this.profile = this.user.getProfilePicture().subscribe((url: any) =>{      
      this.profileImg = url;
    });

    this.wallpaper = this.user.getWallpaper().subscribe((url: any)=>{      
      this.wallpImg = url;
    });    
  }

  ngOnDestroy()   {
    // destroi
    this.profile.unsubscribe();
    this.wallpaper.unsubscribe();
  }

  getProfileImg(event: any) {
    console.log('Input Perfil');
    this.imgPath = event.target.files[0];
  }

  getWallpImg(event: any) {
    console.log('Input Wallpaper');
    this.backgroundPath = event.target.files[0];
  }

  async saveFotos() {
    const user = await this.auth.getAuth().currentUser;    

    // apenas para fins de teste, para testar os ngifs
    console.log('Esconder: ' + this.esconder);

    const profImgPath = `profile-pictures/${user?.uid}`;
    const refProf = await this.storage.upload(profImgPath, this.imgPath);

    refProf.ref.getDownloadURL().then(url => {
      this.profileImg = url;
    });

    const wlppImgPath = `wallpaper-pictures/${user?.uid}`;
    const refWlpp = await this.storage.upload(wlppImgPath, this.backgroundPath);

    refWlpp.ref.getDownloadURL().then(url => {
      this.wallpImg = url;
    });
    
    console.log(this.profileImg);
    console.log(this.wallpImg);

    // finalmente, alterando o estado do booleano
    this.esconder = !this.esconder;
    
  }
}
