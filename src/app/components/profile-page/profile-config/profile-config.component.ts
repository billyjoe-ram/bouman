import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms'
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-config',
  templateUrl: './profile-config.component.html',
  styleUrls: ['./profile-config.component.css']
})
export class ProfileConfigComponent implements OnInit {

  public user: any = { name: '', desc: '', area: '' };

  public areas: any = {};

  constructor(private authService: AuthService, private userService: UsersService, private areasService: AreasService, private service: ProfileService,
     private auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
    // this.userService.getCollection().then((coll) => {
    //   this.user = coll;
    // });
    this.getData();

    this.areas = this.areasService.getAreas();
  }

  async onSubmit(form: NgForm) {
    const user = await this.authService.getAuth().currentUser;

    const formData = form.value;



    try {
          this.service.updateProfile(user?.uid, { name: formData.name, description: formData.desc, area: formData.area })
    }
    catch(err){
      console.log('Ocorreu alguma coisa errado no update dos dados cadastrados...')
    }
    finally{
      console.log("Os dados foram cadastrados.");
      this.router.navigate(["/profile"]);
    }

  }

  async onDelete(form: NgForm) {
    // Prompt the user to re-provide their sign-in credentials
    const email: string = form.value.email;
    const password: string = form.value.senha;

    const user = await this.authService.getAuth().currentUser;

    this.authService.getAuth().credential.subscribe((credential)=>{
      console.log(credential)
    })
    
    console.log(email);
    console.log(password);

  }
  async getData(){
    const user = await this.authService.getAuth().currentUser;
    this.user = this.userService.getCollection(user?.uid);
  }

}
