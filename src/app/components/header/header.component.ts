import { Component, EventEmitter, OnInit, OnChanges, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

@Injectable({
  providedIn: 'root', // <---- Adiciona isto ao serviço
})

export class HeaderComponent implements OnChanges, OnInit, OnDestroy {

  public profileImg: any = ""; 

  private profile!: Subscription;
  
  @Output() featureSelected = new EventEmitter<string>();
  
  collapsed = true;
  
  constructor(private authService:AuthService, private user: UsersService) { }

  ngOnChanges(){

  }

  ngOnInit(): void {
    console.log(54)
    this.profile = this.user.getProfilePicture().subscribe((url:any) => {
      this.profileImg = url;
    });
  }

  ngOnDestroy() {
    console.log(21)
    this.profile.unsubscribe();
  }
  changeprof(){
    
    this.profile = this.user.getProfilePicture().subscribe((url:any) => {
      this.profileImg = url;
      console.log(url);
    })
  }

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }

  logOut(){
    this.authService.logout();
  }
  
}
