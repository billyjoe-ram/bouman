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

  messageError!: string;

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
        //area: this.form.value.area,
        password: this.form.value.passkey,
      };

      const userObject = { area: this.userRegister.area };

      const profileObject = { name: this.userRegister.name };

      try {
        // User sign-up
        const newUser = await this.authService.register(this.userRegister);

        this.form.reset();
        
        const user = newUser.user?.uid;

        // Save the own user doc in users collection
        await this.store.collection('Users').doc(user).set(userObject);

        const profile = await this.store.collection('Profiles').add(profileObject);
        
        // Adding an id field
        await this.store.collection('Users').doc(user).update({ profileId: profile.id });

        this.router.navigate(["/config"]);
      } catch (error) {
        switch(error.code){
          case 'auth/network-request-failed':
            this.messageError = 'Verifique a sua conexão com a internet e tente novamente.';
            break;
          case 'auth/email-already-in-use':
            this.messageError = 'Este email já está cadastrado. Tente outro endereço de email ou recupere a sua senha.';
            break;
          default:
            this.messageError = 'Ocorreu um erro inesperado, tente novamente.';
            break;
        }
      
        console.error(this.messageError);
        console.error(error);
      } /*finally {   
        //Está parte agora está localizada no final do TRY acima     
          this.router.navigate(["/config"]);
        
      }*/

    }
  }

}

