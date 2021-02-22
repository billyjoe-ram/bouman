import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'sign-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css']
})
export class InfosComponent implements OnInit {  
       
  public userRegister: any = {};

  constructor(private authService: AuthService, private router: Router, private store: AngularFirestore) { }

  ngOnInit(): void {
  }

  async signup() {
    const userObject = Object.assign({}, this.userRegister);
    
    delete userObject.email;
    delete userObject.password;

    try {
      const newUser = await this.authService.register(this.userRegister);
      await this.store.collection("Users").doc(newUser.user?.uid).set(userObject);
      await this.authService.addUser(this.userRegister);
      this.router.navigate(["/config"]);
    } catch (error) {
      console.error(error);      
    }

  }

}
