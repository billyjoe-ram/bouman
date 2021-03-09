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

  public userData: {name: string, desc: string} = { name: '', desc: ''};

  @ViewChild('btnPerfil') private divPerfil!: ElementRef;
  @ViewChild('btnFundo') private divFundo!: ElementRef;
  @ViewChild('opacidade') private fotoOpacidade!: ElementRef;

  constructor(
    private storage: AngularFireStorage, 
    private auth: AuthService, 
    private renderer: Renderer2, private user: UsersService) { }
    
  ngOnInit(): void {
    
    // usando o service de usuario para pegar as imagens
    this.profileImg = this.user.getProfilePicture();
    this.wallpImg = this.user.getWallpaper();
    console.log('Link da foto de perfil: ' + this.user.getProfilePicture());        

    console.log('Link do wallpaper: ' + this.user.getWallpaper());
    this.user.getCollection().then(data => {
      this.userData = data;
    });
  }

  async upload($event: any) {
    this.imgPath = $event.target.files[0];
  }  

  wallpaPic() {
    let user;
    this.user.getId().then(data => {
      user = data;
    });
        
    const filePath = `wallpaper-pictures/${user}`;
    const ref = this.storage.upload(filePath, this.imgPath);    
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
      this.renderer.listen(inputPerfil, 'click', () => {
        const user = this.user.getId();

        const filePath = `profile-pictures/${user}`;
        // criando em const só para o caso
        const ref = this.storage.upload(filePath, this.imgPath);
        
        const inputPerfil = document.getElementById('fotoPerfil');
      });
      
      // adicionando ao elemento pai
      this.renderer.appendChild(this.divPerfil.nativeElement, inputPerfil);

      /* Criando label para representar o Input de Perfil
      const lblPerfil = this.renderer.createElement('label');
      const txtPerfil = this.renderer.createText('Clique aqui para enviar um papel de parede');
      const textLabelP = this.renderer.appendChild(lblPerfil, txtPerfil);
      this.renderer.setAttribute(textLabelP, 'id', 'labelPerfil');
      this.renderer.setAttribute(textLabelP, 'for', 'fotoPerfil');
      this.renderer.appendChild(this.divFundo.nativeElement, textLabelP);
      */

      // criando o elemento input para foto de fundo
      const inputFundo = this.renderer.createElement('input');
      //adicionando classe de estilo
      this.renderer.addClass(inputFundo, 'fotoFundo');
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
      
      /* Criando label para representar o Input de Fundo
      const lblFundo = this.renderer.createElement('label');
      const txtFundo = this.renderer.createText('Clique aqui para enviar um papel de parede');
      const textLabelF = this.renderer.appendChild(lblFundo, txtFundo);
      this.renderer.setAttribute(textLabelF, 'id', 'labelFundo');
      this.renderer.setAttribute(textLabelF, 'for', 'fotoFundo');
      this.renderer.appendChild(this.divFundo.nativeElement, textLabelF);
      */
    }

    // finalmente, alterando o estado do booleano
    this.esconder = !this.esconder;

    //Criando opacidade para o background e a foto de perfil:
    this.renderer.setStyle(this.fotoOpacidade, 'opacity', '0.4');
  }

  saveFotos() {
    // apenas para fins de teste, para testar os ngifs
    console.log('Esconder: ' + this.esconder);
    if (this.esconder) {
      // obtendo os elementos criados no editar
      const inputPerfil = document.getElementById('fotoPerfil');
      const inputFundo = document.getElementById('fotoFundo');
      // verificando se vieram
      console.log('O input de perfil: ' + inputPerfil);
      console.log('O input de fundo: ' + inputFundo);
      // removendo-os
      this.renderer.removeChild(this.divPerfil.nativeElement, inputPerfil);
      this.renderer.removeChild(this.divFundo.nativeElement, inputFundo);
    }

    // finalmente, alterando o estado do booleano
    this.esconder = !this.esconder;

    //Removendo opacidade no background e na foto de perfil:
    this.renderer.removeStyle(this.fotoOpacidade, 'opacity');
  }

}
