import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userLogin: any = {};
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  async login() {

    try {
      await this.authService.login(this.userLogin);
      this.router.navigate(["/profile"]);  
    } catch (error) {
      console.error(error);      
    }

  }

}
