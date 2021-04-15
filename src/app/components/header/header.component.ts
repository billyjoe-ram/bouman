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
  public profileId: string = "";

  private profile!: Subscription;
  private userSubs!: Subscription;

  @Output() featureSelected = new EventEmitter<string>();

  collapsed = true;

  constructor(private authService: AuthService, private user: UsersService) { }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy() {
    this.profile.unsubscribe();

    this.userSubs.unsubscribe();
  }

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }

  logOut() {
    this.authService.logout();
  }

  async getData() {
    const user = await this.authService.getAuth().currentUser;

    this.userSubs = this.user.getProfile(user?.uid).subscribe((profile: any) => {
      this.profileId = profile.profileId;

      this.profile = this.user.getProfilePicture(this.profileId).subscribe((url: any) => {
        this.profileImg = url;
      }, (err: any) => {
        this.profileImg = this.user.profasset();
      });
    });

  }

}
