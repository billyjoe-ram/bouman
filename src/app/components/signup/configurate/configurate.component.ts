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
    birth: '',
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
  }

  // Validador personalizado para data de nascimento
  valiDate(input: AbstractControl): ValidationErrors | null{
    const today = new Date();
    let birthString: string = input.value;
    let birthDate: string[] = [];
    
    // Separando a string em um array
    birthDate = birthString.split("-");

    // Criando um novo índice para reorganização
    birthDate.push("00");

    // Criando uma cópia do ano no novo índice
    birthDate[3] = birthDate[0];

    // Primeiro índice - mês
    birthDate[0] = birthDate[1];

    // Segundo índice - dia
    birthDate[1] = birthDate[2];
    
    // Terceiro índice - ano
    birthDate[2] = birthDate[3];

    // Removendo aquele último índice não mais utiizando
    birthDate.pop();

    // Atribuindo à string
    birthString = birthDate.join("/");

    // Sem a perda de tempo
    const profileBirth = new Date(birthString);    

    //pegando o ano de cada data
    const todayYear = today.getFullYear();
    const birthYear = profileBirth.getFullYear();

    //pegando o mês de cada data
    const todayMon = today.getMonth()
    const birthMon = profileBirth.getMonth();

    //pegando o dia de cada data
    const toDay = today.getDate();
    const birthDay = profileBirth.getDate();

    //se a diferença de anos for igual a 14 (14 anos)
    if((todayYear - birthYear) === 14){
      //e o mês atual for igual ao mês de nascimento
      if(todayMon === birthMon){
        //mas o dia de nascimento for menor que o atual, o usuário ainda não fez aniversário
        //ou seja, não completou 14 anos
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
    //se a diferença entre os anos for menor que 14, usuário menor de 14 anos
    if((todayYear - birthYear) < 14){
      return {'response': true};
    }
    //se a diferença entre os anos for igual a 100
    if((todayYear - birthYear) === 100){
      //e o mês atual for igual ao mês de nascimento
      if(todayMon === birthMon) {
        //mas o dia atual é maior que o dia de nascimento, usuário já fez aniversário
        //ou seja, já completou 100 anos
        if(toDay > birthDay || toDay === birthDay){          
          return {'response': true};
        }
      }
      if(todayMon > birthMon) {
        return {'response': true};
      }
    }
    //se a diferença entre os anos for maior que 100, usuário maior de 100 anos
    if((todayYear - birthYear) > 100){
      return {'response': true};
    }
    //caso nenhuma das alternativas, data de nascimento válida
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

        await userProfile.update({ desc: description, following: [], social: []});

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
      profileId = profile.profileId;

      this.userProfile = profile;      
    });
  }

  ngOnDestroy() {
    this.statesSubs.unsubscribe();
    this.citiesSubs.unsubscribe();

    this.profileSubs.unsubscribe();
  }

}
