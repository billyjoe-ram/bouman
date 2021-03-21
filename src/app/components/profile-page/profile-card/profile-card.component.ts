import { templateJitUrl } from '@angular/compiler';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { HeaderComponent } from 'src/app/components/header/header.component'

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

  private profile!: Subscription;
  private wallpaper!: Subscription;  

  constructor(
    private storage: AngularFireStorage, 
    private auth: AuthService, 
    private renderer: Renderer2,
    private user: UsersService,
    private headerprofileimage: HeaderComponent){ }
    
  ngOnInit(): void {
    console.log("testando quero apenas ver se isso vai aparecer no console depois do get bla bla bla")
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
    console.log('teste novamente')
    this.profile.unsubscribe();
    this.wallpaper.unsubscribe();
  }

  getProfileImg(event: any) {
    console.log('1')
    console.log('Input Perfil');
    this.imgPath = event.target.files[0];
    this.imgcheck = true;
  }

  getWallpImg(event: any) {
    console.log('12')
    console.log('Input Wallpaper');
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
      console.log('sei la1');
      this.profileImg = url;
      this.headerprofileimage.changeprof();
    });
  }
    if ( this.backcheck == true){
    const refWlpp = await this.storage.upload(wlppImgPath, this.backgroundPath);
    refWlpp.ref.getDownloadURL().then(url => {
      console.log('sei la2');
      this.wallpImg = url;
    });
  }
    
    console.log(this.profileImg);
    console.log(this.wallpImg);

    // finalmente, alterando o estado do booleano
    this.esconder = !this.esconder;
    
  }
}
