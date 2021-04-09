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

  private emailverified: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: AngularFirestore,
    private areasService: AreasService
  ) { }

  ngOnInit(): void {
    this.areas = this.areasService.getAreas();
  }

  async signup() {
    const user = await this.authService.getAuth().currentUser;
    

    if (this.form.valid && !user) {
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
        // User sign-up
        const newUser = await this.authService.register(this.userRegister);

        this.form.reset();
        
        const user = newUser.user?.uid;

        this.authService.logout();

        this.verifyEmail();

        // Save the own user doc in users collection
        await this.store.collection('Users').doc(user).set(userObject);
        
        // Adding an id field
        await this.store.collection('Users').doc(user).update({ id: user });
      } catch (error) {
        console.error(error);
      } finally {        
        this.router.navigate(["/login"]);        
        
      }

    }
  }

  async verifyEmail() {
    const user = await this.authService.getAuth().currentUser;

    this.emailverified = user?.emailVerified;

    if (!this.emailverified && user != null){

      user.sendEmailVerification().then(() => {
        // Email enviado corretamente.
        user.providerData.forEach((profile:any) => {
          window.alert("Foi enviado um link de verificação de usuário para o seu e-mail: " + profile.email)
        });
      }).catch((error) => {
        // Um erro ocorreu.        
        window.alert('Um erro ocorreu, verifique se na sua caixa de entrada já não possui um link de verificação, caso não haja, tente novamente...');

        console.error(error);
      });
      
    }

  }

}

