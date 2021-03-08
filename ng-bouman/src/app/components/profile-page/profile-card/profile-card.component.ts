import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {

  private imgPath: string = "";
  
  public profileImg: any = "";
  public wallpImg: any = "";

  public esconder: boolean = false;

  @ViewChild('btnPerfil') private divPerfil!: ElementRef;
  @ViewChild('btnFundo') private divFundo!: ElementRef;

  constructor(
    private storage: AngularFireStorage, 
    private auth: AuthService, 
    private renderer: Renderer2, private user: UsersService) { }
    
  ngOnInit(): void {
    // apenas para fins de teste, para testar os ngifs
    console.log('ngOnInit: ' + this.esconder);
    // usando o service de usuario para pegar as imagens
    this.profileImg = this.user.getProfilePicture();
    this.wallpImg = this.user.getWallpaper();
    console.log('Link da foto de perfil: ' + this.user.getProfilePicture());        

    console.log('Link do wallpaper: ' + this.user.getWallpaper());
  }

  async upload($event: any) {
    this.imgPath = $event.target.files[0];
  }  

  wallpaPic() {
    const user = this.user.getId();
        
    const filePath = `wallpaper-pictures/${user}`;
    const ref = this.storage.upload(filePath, this.imgPath);    
  }

  altFoto(){
    // verificando se o botão está como editar ou salvar
    if (this.esconder) {
      // criando o elemento input para foto de perfil
      const inputPerfil = this.renderer.createElement('input');
      // adicionado atributos
      this.renderer.setAttribute(inputPerfil, 'type', 'file');
      this.renderer.setAttribute(inputPerfil, 'id', 'fotoPerfil');
      this.renderer.setAttribute(inputPerfil, 'accept', '*.jpg.png');
      // ouvindo evento
      this.renderer.listen(inputPerfil, 'click', () => {
        const user = this.user.getId();

        const filePath = `profile-pictures/${user}`;
        // criando em const só para o caso
        const ref = this.storage.upload(filePath, this.imgPath);
      });
      
      // adicionando ao elemento pai
      this.renderer.appendChild(this.divPerfil.nativeElement, inputPerfil);

      // criando o elemento input para foto de perfil
      const inputFundo = this.renderer.createElement('input');
      // adicionado atributos
      this.renderer.setAttribute(inputFundo, 'type', 'file');
      this.renderer.setAttribute(inputFundo, 'id', 'fotoFundo');
      this.renderer.setAttribute(inputFundo, 'accept', '*.jpg.png');
      // ouvindo evento
      this.renderer.listen(inputPerfil, 'click', () => {
        const user = this.user.getId();

        const filePath = `wallpaper-pictures/${user}`;
        // criando em const só para o caso
        const ref = this.storage.upload(filePath, this.imgPath);
      });
      // adicionando ao elemento pai
      this.renderer.appendChild(this.divFundo.nativeElement, inputFundo);      
    } else {
      // obtendo os elementos criados na parte truthy do condicional
      const inputPerfil = document.getElementById('fotoPerfil');
      const inputFundo = document.getElementById('fotoFundo');
      // verificando se vieram
      console.log('O input de perfil: ' + inputPerfil);
      console.log('O input de fundo' + inputFundo);
      // removendo-os
      this.renderer.removeChild(this.divPerfil.nativeElement, inputPerfil);
      this.renderer.removeChild(this.divPerfil.nativeElement, inputFundo);
    }

    // finalmente, alterando o estado do booleano para quando a funcao for executada novamente
    this.esconder = !this.esconder;
  }

}
