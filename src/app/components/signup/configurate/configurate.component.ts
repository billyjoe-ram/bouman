import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IbgeService } from 'src/app/services/ibge.service';

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
  
  constructor(
    private authService: AuthService,
    private store: AngularFirestore,
    private ibgeService: IbgeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getStates();
  }

  async onSign() {
    const user = await this.authService.getAuth().currentUser;    

    if (this.form.valid) {

      const description = this.form.value.desc;
      const date = this.form.value.date;
      const state = this.form.value.state;
      const city = this.form.value.city;

      try {
        await this.store.collection('Users').doc(user?.uid).update({ desc: description, birth: date, state: state, city: city });

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
          window.alert("Foi enviado um link de verificação de usuário para o seu e-mail: " + profile.email)
        });
      }).catch((error) => {
        // Um erro ocorreu.        
        window.alert('Um erro ocorreu, verifique se na sua caixa de entrada já não possui um link de verificação, caso não haja, tente novamente...');

        console.error(error);
      });
      
    }

  }

  public getStates() {
    this.ibgeService.getStates().subscribe((res) => {
      const data: any = res as any;
      
      data.forEach((element: any) => {
        const id: number = element.id;
        const sigla: string = element.sigla;
        this.states.push({ id, sigla });
      });          
    });
  }

  public fillCities() {
    const id = this.form.value.state;
    this.cities = [];
    
    this.ibgeService.getCities(id).subscribe(res => {
      const data: any = res as any;

      data.forEach((element: any) => {
        const id: number = element.id;
        const nome: string = element.nome;

        this.cities.push({ id, nome });
      });
    });
    
  }
}
