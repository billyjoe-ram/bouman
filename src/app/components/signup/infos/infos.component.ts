import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { cnpj } from 'cpf-cnpj-validator';

@Component({
  selector: 'sign-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css'],
})
export class InfosComponent implements OnInit {
  @ViewChild('boumanForm') form!: NgForm;
  @ViewChild('boumanFormEmpresa') formEmpresa!: NgForm;

  public userRegister: any = {};
  public areas: any = {};
  public checkForm: boolean = true;

  messageError!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: AngularFirestore,
    private areasService: AreasService
  ) { }

  ngOnInit(): void {
    this.checkingForm(true);
    this.areas = this.areasService.getAreas();
  }

  

  checkingForm(check: boolean) {
    if (check == true){
      document.getElementById('btncompany')?.classList.remove('btnselected');
      document.getElementById('btnuser')?.classList.add('btnselected');
    }
    else{
      document.getElementById('btnuser')?.classList.remove('btnselected');
      document.getElementById('btncompany')?.classList.add('btnselected');
    }
    this.checkForm = check;
  }

  async signup() {
    const user = await this.authService.getAuth().currentUser;

    if (this.checkForm) {
      if (this.form.valid && !user) {
        this.userRegister = {
          name: this.form.value.name,
          email: this.form.value.email,
          password: this.form.value.passkey,
        };

        const profileObject = { name: this.userRegister.name };
          
          try {
            // User sign-up
            const newUser = await this.authService.register(this.userRegister);

            const user = newUser.user?.uid;

            const profile = await this.store.collection('Profiles').add(profileObject);

            // Adding an id field
            await this.store.collection('Users').doc(user).set({ profileId: profile.id });

            this.router.navigate(["/config"]);

            this.form.reset();

            console.log("Vou cadastrar uma pessoa!");
          } catch (error) {
            switch (error.code) {
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
          }
      }
    } else {
      if (cnpj.isValid(this.formEmpresa.value.cnpj)) {
        if (this.formEmpresa.valid && !user) {
          this.userRegister = {
            name: this.formEmpresa.value.name,
            email: this.formEmpresa.value.email,
            cnpj: this.formEmpresa.value.cnpj,
            password: this.formEmpresa.value.passkey,
          };

          const profileObject = { name: this.userRegister.name, cnpj: this.userRegister.cnpj };          

          const whereCnpj = (await this.store.collection('Profiles').ref.where('cnpj', '==', profileObject.cnpj).get()).docs;          

          if (!whereCnpj[0]) {
            const whereName = (await this.store.collection('Profiles').ref.where('name', '==', profileObject.name).get()).docs;

            if (!whereName[0]) {
              try {
                // User sign-up
                const newUser = await this.authService.register(this.userRegister);

                const user = newUser.user?.uid;                

                // Save the own user doc in users collection

                const profile = await this.store.collection('Profiles').add(profileObject);                

                // Adding an id field
                await this.store.collection('Companies').doc(user).set({ profileId: profile.id });
                
                this.formEmpresa.reset();

                this.router.navigate(["/config"]);
              } catch (error) {
                switch (error.code) {
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
                
              }
            } else {
              this.messageError = "O nome já está sendo usado."
            }
          } else {
            this.messageError = "CNPJ já está sendo usado.";
          }
        }
      } else {
        this.messageError = 'Digite um CNPJ válido'
      }
    }
  }
}