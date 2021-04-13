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

  private userData: { name: string, desc: string, area: string } = { name: '', desc: '', area: '' };
  
  constructor(private authService: AuthService, private router: Router,
    private user: UsersService) { }

  ngOnInit(): void {
    
  }

  async login() {
    let user;

    try {
      await this.authService.login(this.userLogin);

      user = await this.authService.getAuth().currentUser;
      
    } catch (error) {
      console.error(error);
    } finally {
      console.log(user?.emailVerified);
      if (user != null && user?.emailVerified) {
        this.router.navigate(["/config"]);
      } else {
        this.router.navigate(["/feed"]);
      }
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
