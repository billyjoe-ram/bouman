import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { IbgeService } from 'src/app/services/ibge.service';
import { UsersService } from 'src/app/services/users.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'configurate',
  templateUrl: './configurate.component.html',
  styleUrls: ['./configurate.component.css'],
})
export class ConfigurateComponent implements OnInit {
  @ViewChild('boumanForm') form!: NgForm;

  public formConfig! : FormGroup;
  public dataConfig = {
    about: '',
    state: '',
    city: '',
    birth: new Date(),
  };

  public states: { id: number, sigla: string }[] = [];  
  public cities: { id: number, nome: string }[] = [];  
  
  private emailverified!: any;

  private statesSubs!: Subscription;
  private citiesSubs!: Subscription;

  private profileSubs!: Subscription;

  messageError: string = '';

  private userProfile: any = {};
  
  constructor(
    private authService: AuthService,
    private store: AngularFirestore,
    private ibgeService: IbgeService,
    private router: Router,
    private usersService: UsersService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.getStates();

    this.getData();
  }

  //retorna os controles do formulário('about', 'state', 'city' e 'birth') para serem utilizados no *ngIf do formulário no HTML
  get f() {
    return this.formConfig.controls; 
  }

  createForm(){
    this.formConfig = new FormGroup({
      'about' : new FormControl(this.dataConfig.about, [Validators.required, Validators.minLength(15), Validators.maxLength(300)]),
      'state' : new FormControl(this.dataConfig.state, [Validators.required]),
      'city' : new FormControl(this.dataConfig.city, [Validators.required]),
      'birth' : new FormControl(this.dataConfig.birth, [Validators.required, this.valiDate])
    });

    console.log(this.formConfig);
  }

  //validador personalizado para data de nascimento
  valiDate(input: AbstractControl): ValidationErrors | null{

    /* TENTATIVA 2, falha:
    const today = new Date();
    const birth = new Date(input.value);

    const ageMin = (((60 * 60 * 24) * 365) * 14);
    const ageMax = (((60 * 60 * 24) * 365) * 100);

    if((birth.getUTCSeconds() < ageMin) || (birth.getUTCSeconds() > ageMax)){
      return {'response': true};
    }

    return null;*/

    /*TENTATIVA 1, não testada:
    //pegando o ano de cada data
    const todayYear = today.getFullYear();
    const birthYear = birth.getFullYear();

    //pegando o mês de cada data
    const todayMon = today.getMonth()
    const birthMon = birth.getMonth();

    //pegando o dia de cada data
    const toDay = today.getDay();
    const birthDay = birth.getDay();

    //se a diferença de anos for igual a 16 (16 anos)
    if((todayYear - birthYear) === 16){
      //e o mês atual for igual ao mês de nascimento
      if(todayMon === birthMon){
        //mas o dia de nascimento for menor que o atual, o usuário ainda não fez aniversário
        //ou seja, não completou 16 anos
        if(toDay < birthDay){
          return {'response': true};
        }
      }
      //se o mês atual for menor que o mês de nascimento, o usuário ainda não fez aniversário
      //ou seja, não completo 16 anos
      else if(todayMon < birthMon){
        return {'response': true};
      }
    }
    //se a diferença entre os anos for menor que 16, usuário menor de 16 anos
    if((todayYear - birthYear) < 16){
      return {'response': true};
    }
    //se a diferença entre os anos for igual a 100
    if((todayYear - birthYear) === 100){
      //e o mês atual for igual ao mês de nascimento
      if(todayMon === birthMon){
        //mas o dia atual é maior que o dia de nascimento, usuário já fez aniversário
        //ou seja, já completou 100 anos
        if(toDay > birthDay){
          return {'response': true};
        }
      }
    }
    //se a diferença entre os anos for maior que 100, usuário maior de 100 anos
    if((todayYear - birthYear) > 100){
      return {'response': true};
    }
    //caso nenhuma das alternativas, data de nascimento válida =)*/
    return null;
  }

  async onSign(form: any) {
    const user = await this.authService.getAuth().currentUser;

    if (this.formConfig.valid) {

      const description = this.formConfig.value.about;
      const date = this.formConfig.value.birth;
      const state = this.formConfig.value.state;
      const city = this.formConfig.value.city;

      try {

        const userProfile = this.store.collection('Profiles').doc(this.userProfile.profileId);

        await this.store.collection('Users').doc(user?.uid).update({ birth: date, state: state, city: city });

        await userProfile.update({ desc: description });

        this.authService.logout();

        this.verifyEmail();

      } catch (error) {
        switch(error.code){
          case 'auth/argument-error':
            this.messageError = 'Por favor, preencha os campos corretamente.';
            break;
          case 'auth/network-request-failed':
            this.messageError = 'Verifique a sua conexão com a internet e tente novamente.';
            break;
          default:
            this.messageError = 'Ocorreu um erro inesperado, tente novamente.';
            break;
        }
      
        console.error(this.messageError);
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
    const id = this.formConfig.value.state;
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
