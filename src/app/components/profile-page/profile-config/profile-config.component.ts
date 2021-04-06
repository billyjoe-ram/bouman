import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile-config',
  templateUrl: './profile-config.component.html',
  styleUrls: ['./profile-config.component.css']
})
export class ProfileConfigComponent implements OnInit {

  public user: any = {  name: '', desc: '', area: '' };

  public areas: any = {};
  
  constructor(private authService: AuthService, private userService: UsersService, private areasService: AreasService, private service: ProfileService) { }

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

  async onDelete() {
    const user = await this.authService.getAuth().currentUser;

    // we must create and alert here, please dont delete the user so easily!!!

    this.service.deleteProfile(user?.uid);
  }

}
