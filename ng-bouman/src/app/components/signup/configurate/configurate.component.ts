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

  constructor(
    private authService: AuthService,
    private store: AngularFirestore,
    private router: Router,
    private ibgeService: IbgeService
  ) {}

  ngOnInit(): void {
    this.getStates();
  }

  async config() {
    const user = await this.authService.getAuth().currentUser;
    const description = this.form.value.desc;
    const date = this.form.value.date;
    const state = this.form.value.state;
    const city = this.form.value.city;

    if (this.form.valid) {
      try {
        await this.store
          .collection('Users')
          .doc(user?.uid)
          .update({ desc: description, birth: date, state: state, city: city });
      } catch (error) {
        console.error(error);
      } finally {
        this.router.navigate(['/profile']);
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
