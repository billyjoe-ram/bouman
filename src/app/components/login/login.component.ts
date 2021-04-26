import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('pass') inputPass!: ElementRef;

  @ViewChild('box') boxPass!: ElementRef;
  
  public userLogin: any = {};

  messageError!: string;

  private userData: { name: string, desc: string, area: string } = { name: '', desc: '', area: '' };
  
  constructor(private authService: AuthService, private router: Router,
    private user: UsersService) { }

  ngOnInit(): void {
    
  }

  async login() {
    let user;

    try {
      await this.authService.login(this.userLogin);

      this.router.navigate(["/feed"]);
    } catch (error) {
      switch(error.code){
        case 'auth/argument-error':
          this.messageError = 'Por favor, preencha os campos corretamente.';
          break;
        case 'auth/user-not-found':
          this.messageError = 'Este email não está cadastrado.';
          break;
        case 'auth/wrong-password':
          this.messageError = 'A senha digitada está incorreta.';
          break;
        case 'auth/invalid-email':
          this.messageError = 'Email inválido, preencha o campo corretamente.';
          break;
        case 'auth/too-many-requests':
          this.messageError = 'Número de tentativas excedido, tente novamente mais tarde.';
          break;
        case 'auth/network-request-failed':
          this.messageError = 'Verifique a sua conexão com a internet e tente novamente.';
          break;
        default:
          this.messageError = 'Ocorreu um erro inesperado, tente novamente.';
          break;
      }

      //this.createAlert(this.messageError, error.code);
      console.error(this.messageError);
      console.error(error);
    } 
    // finally {
    //   this.userData = this.user.getCollection(user?.uid)

    //   if(user != null){
    //     if(user?.emailVerified){
    //       if(!this.userData.desc){
    //         this.router.navigate(["/config"]);
    //       } else {
    //         this.router.navigate(["/feed"]);
    //       }
    //     } else {
    //       console.log("Que tal autenticar seu e-mail antes?")
    //     }
    //   } else {
    //     console.log("Você primeiro deve logar ;)")
    //   }
    // }

  }

  getKey(event: any) {
    
    if (event.keyCode === 13) {
      event.preventDefault();

      this.login();
    }
  }

  showPassword() {
    const password: HTMLInputElement = this.inputPass.nativeElement;

    const passbox: HTMLInputElement = this.boxPass.nativeElement;

    if (password.type === "password") {
      password.type = "text";
      passbox.checked = true;
    } else {
      password.type = "password";
      passbox.checked = false;
    }
  }

}
