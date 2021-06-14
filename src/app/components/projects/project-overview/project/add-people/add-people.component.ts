import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.css']
})
export class AddPeopleComponent implements OnInit {

  @Output('selectedProfile') public selectedProfileEvent: EventEmitter<string> = new EventEmitter<string>();
  
  public profilesFollowed: { profileId: string, name: string, picture: string, isFollowing: boolean }[] = [];
  
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

  onProfilesSelected(selectedProfile: any) {
    // this.selectedProfileEvent.emit(selectedProfile);
    this.selectedProfile = selectedProfile;
  }

  addProfileToProject() {
    this.selectedProfileEvent.emit(this.selectedProfile);
  }

  private async loadUserData() {
    const uid: string | undefined = await this.usersService.getUid();

    this.userSubs = (await this.usersService.getProfile(uid)).subscribe((user: any) => {
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
        // If there's an id in the document (profile exists)  
        if (profile.id) {
          const emptyValueObject = { profileId: "", name: "", picture: "", isFollowing: false };
          const profFolFollows: (string | undefined)[] = (profile.data() as any).following;

          // Creating and empty value object in that index position
          this.profilesFollowed[index] = emptyValueObject;
          this.profilesFollowed[index].name = (profile.data() as any).name;
          this.profilesFollowed[index].profileId = profileFollowed;

          // If the profile is following you, isFollowing = true
          if (profFolFollows.includes(this.profileId)) {
            this.profilesFollowed[index].isFollowing = true;
          } else {
            this.profilesFollowed[index].isFollowing = false;
          }
        }        
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
