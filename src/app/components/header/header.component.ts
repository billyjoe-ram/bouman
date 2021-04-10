import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

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

  private profile!: Subscription;
  
  @Output() featureSelected = new EventEmitter<string>();
  
  collapsed = true;
  
  constructor(private authService:AuthService, private user: UsersService) { } 

  ngOnInit(): void {

    this.user.getProfilePicture().then((url: any) => {
      this.profile = url.subscribe((profP: any) => {
        this.profileImg = profP;
      }, (err: any) => {
        this.profileImg = this.user.profasset();
      });      
    });
    
  }

  ngOnDestroy() {
    this.profile.unsubscribe();
  }  

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }

  logOut(){
    this.authService.logout();
  }
  
}
