import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.css']
})
export class AddPeopleComponent implements OnInit {

  public profilesFollowed: any = [];
  
  private userProfilesFollowed: string[] = [];

  private profileId: string | undefined = "";

  private selectedProfile: string = "";
  
  private userSubs!: Subscription;

  private userProfileSubs!: Subscription;

  private followingSubs!: Subscription;
  
  constructor(private usersService: UsersService, private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  onProfilesSelected(selectedProfile: string) {
    this.selectedProfile = selectedProfile;

    console.log(this.selectedProfile);
  }

  private async loadUserData() {
    const uid: string | undefined = await this.usersService.getUid();

    this.userSubs = this.usersService.getProfile(uid).subscribe((user: any) => {
      this.profileId =  user.profileId;

      this.loadUserProfileData();
    });
  }

  private loadUserProfileData() {
    this.userProfileSubs = this.profileService.getProfile(this.profileId).subscribe((profile: any) => {
      this.userProfilesFollowed = profile.following;      
      this.loadProfileFollowings();
    });
  }

  private loadProfileFollowings() {
    this.userProfilesFollowed.forEach((profileFollowed, index) => {
      this.profileService.getProfilePromise(profileFollowed).then((profile) => {
        this.profilesFollowed[index] = profile.data();
        this.profilesFollowed[index].profileId = profileFollowed;
      });

      this.usersService.getSearchPic(profileFollowed).then(pic => {
        this.profilesFollowed[index].picture = pic;
      }).catch(() => {
        this.profilesFollowed[index].picture = this.usersService.profasset();
      });

    });    
  }

  ngOnDestroy() {
    if (this.userSubs) {
      this.userSubs.unsubscribe();
    }

    if(this.userProfileSubs) {
      this.userProfileSubs.unsubscribe();
    }

    if (this.followingSubs) {
      this.followingSubs.unsubscribe();
    }
  }

}
