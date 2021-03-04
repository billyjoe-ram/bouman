import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'configurate',
  templateUrl: './configurate.component.html',
  styleUrls: ['./configurate.component.css']
})
export class ConfigurateComponent implements OnInit {    
  @ViewChild('boumanForm') form!: NgForm;
  
  public genders: string[] = ['Masculino', 'Feminino'];
  
  constructor(private authService: AuthService, private store: AngularFirestore, private router: Router) { }

  ngOnInit(): void {
  }

  async config() {
    const user = await this.authService.getAuth().currentUser;        
    const description = this.form.value.desc;
    const gender = this.form.value.gender;
    try {
      await this.store.collection("Users").doc(user?.uid).update({ desc: description, sex: gender });
    } catch(error) {
      console.error(error);
    } finally {
      this.router.navigate(['/profile']);
    }
  }

}
