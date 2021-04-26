import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { IbgeService } from 'src/app/services/ibge.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'configurate',
  templateUrl: './configurate.component.html',
  styleUrls: ['./configurate.component.css'],
})
export class ConfigurateComponent implements OnInit {
  @ViewChild('boumanForm') form!: NgForm;
  
  public states: { id: number, sigla: string }[] = [];  
  public cities: { id: number, nome: string }[] = [];  
  
  private emailverified!: any;

  private statesSubs!: Subscription;
  private citiesSubs!: Subscription;

  private profileSubs!: Subscription;

  private userProfile: any = {};
  
  constructor(
    private authService: AuthService,
    private store: AngularFirestore,
    private ibgeService: IbgeService,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.getStates();

    this.getData();
  }

  async onSign() {
    const user = await this.authService.getAuth().currentUser;

    if (this.form.valid) {

      const description = this.form.value.desc;
      const date = this.form.value.date;
      const state = this.form.value.state;
      const city = this.form.value.city;

      try {

        const userProfile = this.store.collection('Profiles').doc(this.userProfile.profileId);

        await this.store.collection('Users').doc(user?.uid).update({ birth: date, state: state, city: city });

        await userProfile.update({ desc: description });

        this.authService.logout();

        this.verifyEmail();

      } catch (error) {
        console.error(error);
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
          document.getElementById("ModalVerify")?.click();
        });
      }).catch((error) => {
        // Um erro ocorreu.        
        window.alert('Um erro ocorreu, verifique se na sua caixa de entrada já não possui um link de verificação...');

        console.error(error);
      });
      
    }

  }

  getStates() {
    this.statesSubs =  this.ibgeService.getStates().subscribe((res) => {
      const data: any = res as any;
      
      data.forEach((element: any) => {
        const id: number = element.id;
        const sigla: string = element.sigla;
        this.states.push({ id, sigla });
      });          
    });
  }

  fillCities() {
    const id = this.form.value.state;
    this.cities = [];
    
    this.citiesSubs = this.ibgeService.getCities(id).subscribe(res => {
      const data: any = res as any;

      data.forEach((element: any) => {
        const id: number = element.id;
        const nome: string = element.nome;

        this.cities.push({ id, nome });
      });
    });
    
  }

  async getData(){
    const user = await this.authService.getAuth().currentUser;
    
    let profileId;
    
    
    this.profileSubs = this.usersService.getProfile(user?.uid).subscribe((profile: any) => {
      console.log(profile);

      profileId = profile.profileId;

      this.userProfile = profile;

      console.log(profileId);
    });
  }

  ngOnDestroy() {
    this.statesSubs.unsubscribe();
    this.citiesSubs.unsubscribe();

    this.profileSubs.unsubscribe();
  }

}
