import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sign-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css'],
})
export class InfosComponent implements OnInit {
  @ViewChild('boumanForm') form!: NgForm;

  public userRegister: any = {};
  public areas: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: AngularFirestore,
    private areasService: AreasService
  ) {}

  ngOnInit(): void {
    this.areas = this.areasService.getAreas();
  }

  async signup() {        

    if (this.form.valid) {
      this.userRegister = {
        name: this.form.value.name,
        email: this.form.value.email,
        area: this.form.value.area,
        password: this.form.value.passkey,
      };

      const userObject = Object.assign({}, this.userRegister);      

      delete userObject.email;
      delete userObject.password;       
               
      try {
      const newUser = await this.authService.register(this.userRegister);        
  
      await this.store
        .collection('Users')
        .doc(newUser.user?.uid)
        .set(userObject);
  
      userObject.id = newUser.user?.uid;
  
      await this.store
        .collection('Users')
        .doc(newUser.user?.uid)
        .update(userObject);
    } catch (error) {
      console.error(error);
    } finally {
              this.router.navigate(['/config']);
    }
  }
}
}

