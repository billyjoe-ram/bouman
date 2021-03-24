import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
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
  private imgcheck: boolean = false;
  private backgroundPath: any = "";
  private backcheck: boolean = false;  

  constructor(
    private storage: AngularFireStorage, 
    private auth: AuthService, 
    private renderer: Renderer2,
    private user: UsersService){ }
    
  ngOnInit(): void {    
    this.user.getCollection().then(data => {
      this.userData = data;
    });

    // usando o service de usuario para pegar as imagens    

    this.profileImg = this.user.getProfilePicture();
    this.wallpImg = this.user.getWallpaper();

    if (!this.profileImg) {
      this.profileImg = "/assets/profile-example.png";
    }

    if (!this.wallpImg) {
      this.wallpImg = "/assets/wallpaper-example.jpg";
    }    

  }

  ngOnDestroy()   {
    // destroi
    console.log('Destruído!');
  }

  getProfileImg(event: any) {        
    this.imgPath = event.target.files[0];
    this.imgcheck = true;
  }

  getWallpImg(event: any) {        
    this.backgroundPath = event.target.files[0];
    this.backcheck = true
  }

  async saveFotos() {
    const user = await this.auth.getAuth().currentUser;    

    // apenas para fins de teste, para testar os ngifs
    console.log('Esconder: ' + this.esconder);
    console.log("profile input:"+ this.imgPath)
    console.log("background input:"+ this.backgroundPath);
    
    const profImgPath = `profile-pictures/${user?.uid}`;
    const wlppImgPath = `wallpaper-pictures/${user?.uid}`;
    if (this.imgcheck == true){
    const refProf = await this.storage.upload(profImgPath, this.imgPath); 
    refProf.ref.getDownloadURL().then(url => {      
      this.profileImg = url;
    });
  }
    if ( this.backcheck == true){
    const refWlpp = await this.storage.upload(wlppImgPath, this.backgroundPath);
    refWlpp.ref.getDownloadURL().then(url => {      
      this.wallpImg = url;
    });
  }
    
    console.log(this.profileImg);
    console.log(this.wallpImg);

    // finalmente, alterando o estado do booleano
    this.esconder = !this.esconder;
    
  }
}
