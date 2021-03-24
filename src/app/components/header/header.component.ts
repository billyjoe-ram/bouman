import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

@Injectable({
  providedIn: 'root',
})

export class HeaderComponent implements OnInit, OnDestroy {

  public profileImg: any = "";   
  
  @Output() featureSelected = new EventEmitter<string>();
  
  collapsed = true;
  
  constructor(private authService:AuthService, private user: UsersService) { } 

  ngOnInit(): void {
    this.profileImg = this.user.getProfilePicture();

    if (!this.profileImg) {
      this.profileImg = "/assets/profile-example.png";
    }
    
  }

  ngOnDestroy() {
    console.log('Destroyed!!');    
  }  

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }

  logOut(){
    this.authService.logout();
  }
  
}
