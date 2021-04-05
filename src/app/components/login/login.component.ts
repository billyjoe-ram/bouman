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
  
  constructor(private authService: AuthService, private router: Router,
    private user: UsersService) { }

  ngOnInit(): void {
  }

  async login() {
    let user, area;   

    try {
      await this.authService.login(this.userLogin);

      user = await this.authService.getAuth().currentUser;

      area = this.user.getArea();
      
    } catch (error) {
      console.error(error);
    } finally {
      if (user != null && area) {
        this.router.navigate(["/feed"]);
      } else {
        this.router.navigate(["/config"]);
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
