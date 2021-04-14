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
      } catch (error) {
        console.error(error);
      } finally {        
        this.router.navigate(["/config"]);
        
      }

    }
  }

}

