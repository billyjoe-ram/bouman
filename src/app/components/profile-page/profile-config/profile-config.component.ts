import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AreasService } from 'src/app/services/areas.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile-config',
  templateUrl: './profile-config.component.html',
  styleUrls: ['./profile-config.component.css']
})
export class ProfileConfigComponent implements OnInit {

  public user: any = {  name: '', desc: '', area: '' };

  public areas: any = {};
  
  constructor(private userService: UsersService, private areasService: AreasService) { }

  ngOnInit(): void {    
    this.userService.getCollection().then((coll) => {
      this.user = coll;
    });

    this.areas = this.areasService.getAreas();
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
  }

  onDelete() {
    alert("I can't do this right know. Thank you for the comprehension.");
  }

}
