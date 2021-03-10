import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'sign-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css'],
})
export class InfosComponent implements OnInit {
  @ViewChild('boumanForm') form!: NgForm;

  public userRegister: any = {};
  public areas: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: AngularFirestore,
    private areasService: AreasService
  ) {}

  ngOnInit(): void {
    this.areas = this.areasService.getAreas();
  }

  async signup() {
    const userObject = this.userRegister;

    delete userObject.email;
    delete userObject.password;
    
    // this.validaForm();
    // this.validaSenha();
    if (this.form.valid) {
      this.userRegister = {
        name: this.form.value.name,
        email: this.form.value.email,
        area: this.form.value.area,
        password: this.form.value.passkey,
      };                  

      try {
        const newUser = await this.authService.register(this.userRegister);

        delete this.userRegister.email;
        delete this.userRegister.password;

        console.log(this.userRegister);     

        await this.store
          .collection('Users')
          .doc(newUser.user?.uid)
          .set(this.userRegister);
        this.userRegister.id = newUser.user?.uid;
        await this.store
          .collection('Users')
          .doc(newUser.user?.uid)
          .update(this.userRegister);
      } catch (error) {
        console.error(error);
      } finally {
        this.router.navigate(['/config']);
      }
    }
  }

  // NÃO TÁ FUNCIONANDO
  // validaSenha(passkey: NgModel): boolean {
  //   const senha: string = passkey.viewModel;
  //   let valida: boolean = false;

  //   if (!passkey.valid && passkey.touched) {
  //     if (senha.length >= 8) {
  //       valida = true;
  //     } else {
  //       valida = false;
  //     }
  //   }
  //   return valida;
  // }

  // NÃO TÁ FUNCIONANDO
  // validaForm(){
  //   if(!this.form.valid){
  //     this.form.value[nome].markAsTouched();

  //     if(this.form.value[nome].invalid){
  //       this.form.value[nome].focus();
  //       return this.exibeErro(nome);
  //     }
  //     return false;
  //   } else {
  //     return true;
  //   }

  // }

  // NÃO TÁ FUNCIONANDO
  // exibeErro(nome: string){
  //   if(!this.form.value[nome]){
  //     return false;
  //   }
  //   return this.form.value[nome].touched && this.form.value[nome].invalid;
  // }
}
