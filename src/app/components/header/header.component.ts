import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public profileImg: any = ""; 

  private profile!: Subscription;
  
  @Output() featureSelected = new EventEmitter<string>();
  
  collapsed = true;
  
  constructor(private authService:AuthService, private user: UsersService) { }

  ngOnInit(): void {
    this.profile = this.user.getProfilePicture().subscribe((url:any) => {
      this.profileImg = url;
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
