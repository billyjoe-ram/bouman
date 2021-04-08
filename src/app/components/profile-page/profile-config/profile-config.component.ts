import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-profile-config',
  templateUrl: './profile-config.component.html',
  styleUrls: ['./profile-config.component.css']
})
export class ProfileConfigComponent implements OnInit {

  public user: any = { name: '', desc: '', area: '' };

  public areas: any = {};

  constructor(private authService: AuthService, private userService: UsersService, private areasService: AreasService, private service: ProfileService, private auth: AngularFireAuthModule) { }

  ngOnInit(): void {
    this.userService.getCollection().then((coll) => {
      this.user = coll;
    });

    this.areas = this.areasService.getAreas();
  }

  async onSubmit(form: NgForm) {
    const user = await this.authService.getAuth().currentUser;

    const formData = form.value;

    console.log(formData);

    this.service.updateProfile(user?.uid, { name: formData.name, description: formData.desc, area: formData.area })
  }

  async onDelete(form: NgForm) {
    // Prompt the user to re-provide their sign-in credentials
    const email: string = form.value.email;
    const password: string = form.value.senha;

    const user = await this.authService.getAuth().currentUser;
    
    const credential = await this.authService.getAuth();
    
    console.log(email);
    console.log(password);
    if (user != null && (email != null || email != undefined || password != null || password != undefined)) {
      // user.reauthenticateWithCredential(email).then(() => {
      //   // User re-authenticated.
      //   this.service.deleteProfile(user?.uid);
      //   this.service.deleteProfile(user?.uid);
      // }).catch(function (error) {
      //   // An error happened.
      // });

    }

  }

}
