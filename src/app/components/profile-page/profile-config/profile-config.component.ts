import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile-config',
  templateUrl: './profile-config.component.html',
  styleUrls: ['./profile-config.component.css']
})
export class ProfileConfigComponent implements OnInit {

  public user: any = {  name: '', desc: '' };

  private areaSubs!: Subscription;
  
  constructor(private userService: UsersService) { }

  ngOnInit(): void {    
    this.user = this.userService.getCollection();

    const userData = Object.assign({}, this.user);

    userData.area = this.userService.getArea();    
  }

}
