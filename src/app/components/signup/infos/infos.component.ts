import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
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
  emailverified : boolean = false;
  teste !: Subscription;

  constructor(
    private firebase: AngularFireAuth,
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

      const user = await this.authService.getAuth().currentUser;
      if (user != null){
      user.sendEmailVerification().then(function (){
        // Email enviado corretamente.
        user.providerData.forEach(function (profile:any) {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL)
        console.log("  E-mail verified?: " + profile.verified);
        })
    }).catch(function(error){
      // Um erro ocorreu.
        console.log('um erro ocorreu');
        user.reload().then(function(){
        console.log("  E-mail verified22222: " + user.emailVerified);})
    })
    }
    } catch (error) {
      console.error(error);
    } finally {
      this.router.navigate(['/profile']);
    }
  }
}
}

