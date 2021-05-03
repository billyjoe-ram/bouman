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

  @ViewChild('passwordInput') inputPass!: ElementRef;

  @ViewChild('box') boxPass!: ElementRef;
  
  public userLogin: any = {};

  public messageError: string = "";

  private userData: { name: string, desc: string, area: string } = { name: '', desc: '', area: '' };
  
  constructor(private authService: AuthService, private router: Router,
    private user: UsersService) { }

  ngOnInit(): void { }

  async login() {
    let user;

    try {
      // Tentando logar o usuário
      await this.authService.login(this.userLogin);

      // Navegando para o feed se logou
      this.router.navigate(["/feed"]);
    } catch (error) {

      // Personalizando mensagens de erro
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

      // Limitando o alert a aparcer somente 5s
      setTimeout(() => {
        this.messageError = "";
      }, 5000);

    }

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
