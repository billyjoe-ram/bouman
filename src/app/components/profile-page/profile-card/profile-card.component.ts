import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
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

  private imgPath: any = "";
  private backgroundPath: any = "";
  
  public profileImg: any = "";  
  public wallpImg: any = "";
  private profile!: Subscription;
  private wallpaper!: Subscription;

  public esconder: boolean = false;

  public userData: {name: string, desc: string} = { name: '', desc: ''};

  @ViewChild('btnPerfil') private divPerfil!: ElementRef;
  @ViewChild('btnFundo') private divFundo!: ElementRef;
  @ViewChild('opacidade') private fotoOpacidade!: ElementRef;

  constructor(
    private storage: AngularFireStorage, 
    private auth: AuthService, 
    private renderer: Renderer2,
    private user: UsersService) { }
    
  ngOnInit(): void {        
    this.user.getCollection().then(data => {
      this.userData = data;
    });
    // usando o service de usuario para pegar as imagens
    this.profile = this.user.getProfilePicture().subscribe(url=>{
      console.log(url);
      this.profileImg = url;
    });
    this.wallpaper = this.user.getWallpaper().subscribe(url=>{
      console.log(url);
      this.wallpImg = url;
    })
  }

  ngOnDestroy()   {
    // destroi
    this.profile.unsubscribe();
    this.wallpaper.unsubscribe();
  }  

  altFoto(){
    // apenas para fins de teste, para testar os ngifs
    console.log('Esconder: ' + this.esconder);
    // verificando se o botão está como editar ou salvar
    if (!this.esconder) {
      // criando o elemento input para foto de perfil
      const inputPerfil = this.renderer.createElement('input');
      //adicionando classe de estilo
      this.renderer.addClass(inputPerfil, 'fotoPerfil');
      // adicionado atributos
      this.renderer.setAttribute(inputPerfil, 'type', 'file');
      this.renderer.setAttribute(inputPerfil, 'id', 'fotoPerfil');
      this.renderer.setAttribute(inputPerfil, 'accept', '*.jpg.png');
      // ouvindo evento
      this.renderer.listen(inputPerfil, 'change', ($event: any) => {
        
        console.log('Input Perfil');
        this.imgPath = $event.target.files[0];
      });
      
      // adicionando ao elemento pai
      this.renderer.appendChild(this.divPerfil.nativeElement, inputPerfil);      

      // criando o elemento input para foto de fundo
      const inputFundo = this.renderer.createElement('input');
      //adicionando classe de estilo
      this.renderer.addClass(inputFundo, 'fotoFundo');
      // adicionado atributos
      this.renderer.setAttribute(inputFundo, 'type', 'file');
      this.renderer.setAttribute(inputFundo, 'id', 'fotoFundo');
      this.renderer.setAttribute(inputFundo, 'accept', '*.jpg.png');
      // ouvindo evento
      this.renderer.listen(inputFundo, 'change', ($event: any) => {
        
        console.log('Input Wallpaper');
        this.backgroundPath = $event.target.files[0];        
      });

      // adicionando ao elemento pai
      this.renderer.appendChild(this.divFundo.nativeElement, inputFundo);  
            
    }

    // finalmente, alterando o estado do booleano
    this.esconder = !this.esconder;
    
  }

  async saveFotos() {
    const user = await this.auth.getAuth().currentUser;    

    // apenas para fins de teste, para testar os ngifs
    console.log('Esconder: ' + this.esconder);

    if (this.esconder) {
      const profImgPath = `profile-pictures/${user?.uid}`;
      const refProf = await this.storage.upload(profImgPath, this.imgPath);          

      const wlppImgPath = `wallpaper-pictures/${user?.uid}`;
      const refWlpp = await this.storage.upload(wlppImgPath, this.backgroundPath);

      console.log(this.profileImg);
      console.log(this.wallpImg);
      
      // obtendo os elementos criados no editar
      const inputPerfil = document.getElementById('fotoPerfil');
      const inputFundo = document.getElementById('fotoFundo');
      
      // removendo-os
      this.renderer.removeChild(this.divPerfil.nativeElement, inputPerfil);
      this.renderer.removeChild(this.divFundo.nativeElement, inputFundo);      
    }

    // finalmente, alterando o estado do booleano
    this.esconder = !this.esconder;
    
  }
}
