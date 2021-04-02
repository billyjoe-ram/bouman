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

  public genders: string[] = ['Masculino', 'Feminino'];
  public states: { id: number, sigla: string }[] = [];  
  public cities: { id: number, nome: string }[] = [];  
  emailverified : any;
  
  constructor(
    private authService: AuthService,
    private store: AngularFirestore,
    private router: Router,
    private ibgeService: IbgeService
  ) {}

  ngOnInit(): void {
    this.getStates();
    this.config();
  }

  async config() {

      const user = await this.authService.getAuth().currentUser;
      await user?.reload();
      this.emailverified = user?.emailVerified; 
      if (this.emailverified == undefined || this.emailverified == false){
        if (user != null){
        user.sendEmailVerification().then(function (){
          // Email enviado corretamente.
          user.providerData.forEach(function (profile:any) {
            window.alert("Foi enviado um link de verificação de usuário para o seu E-mail, por favor na sua caixa de entrada: "+profile.email)
          })
      }).catch(function(error){
        // Um erro ocorreu.
          window.alert('um erro ocorreu, verifique se na sua caixa de entrada já não possui um link de verificação, caso não haja, tente novamente...');
      })
      }
    }else if(this.emailverified == true){

      if (this.form.valid) {

      const description = this.form.value.desc;
      const date = this.form.value.date;
      const state = this.form.value.state;
      const city = this.form.value.city;
      try {
        await this.store
          .collection('Users')
          .doc(user?.uid)
          .update({ desc: description, birth: date, state: state, city: city });
        
          window.alert('E-mail foi verificado, você será redirecionado para pagína do seu perfil.');
          this.router.navigate(['/profile'])
      } catch (error) {
        console.error(error);
      }
    }    
    else{
      console.log("Ocorreu um erro no formulário.");
      window.alert("Ocorreu um erro no formulário.");
    }
  }
    // this.validaData();
  }

  validaData(){
    var data = this.form.value.date;
    var dataAtual = new Date();
    var nascimento = new Date(data)
    var ano = dataAtual.getFullYear() - nascimento.getFullYear();
 
    if(ano == 18){
      if(dataAtual.getMonth() == nascimento.getMonth()){
        if(dataAtual.getDay() <= nascimento.getDay()){
          //menor de idade
        }
        else{
          //maior de idade
        }
      }
      else if(dataAtual.getMonth() < nascimento.getMonth()){
        //menor de idade
      }
      else{
        //maior de idade
      }
    }
    else if(ano < 18){
      //menor de idade
    }
    else{
      //maior de idade
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
