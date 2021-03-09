import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public profileImg: any = "";          
  
  @Output() featureSelected = new EventEmitter<string>();
  
  collapsed = true;
  
  constructor(private authService:AuthService, private user: UsersService) { }

  ngOnInit(): void {
    this.profileImg = this.user.getProfilePicture();
  }

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }

  logOut(){
    this.authService.logout();
  }
  
}
