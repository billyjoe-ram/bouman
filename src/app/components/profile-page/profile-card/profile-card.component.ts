import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit, OnDestroy, OnChanges {

  @Input('profileId') public profileId: string = "";
  @Input('userId') public userId: string | undefined = "";
  @Input('editMode') public editbutton: boolean = false;
  @Input('userData') public userData: any = {};
  
  @ViewChild('btnFollow') btnFollow!: ElementRef;
  
  public esconder: boolean = false;

  public profileImg: any = "";
  public wallpImg: any = "";

  private userProfile: string = "";
  private userFollowing: string[] = [];

  private i: number = 0;
  
  private profile!: Subscription;
  private wallpaper!: Subscription;

  private imgPath: any = "";
  private imgcheck: boolean = false;
  private backgroundPath: any = "";
  private backcheck: boolean = false;

  private profileSubs!: Subscription;
  private userSubs!: Subscription;
  private userProfileSubs!: Subscription;

  private paramsSubs!: Subscription;

  constructor(
    private storage: AngularFireStorage,
    private auth: AuthService,
    private user: UsersService,
    private profileService: ProfileService,
    private usersServices : UsersService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {}

  ngOnChanges() {
    this.esconder = false;

    if(this.profileId) {
      // Loading profile data
      this.loadData();      
    }
       
  }

  ngOnDestroy() {
    this.profile.unsubscribe();
    this.wallpaper.unsubscribe();

    this.profileSubs.unsubscribe();
    this.paramsSubs.unsubscribe();

    this.userSubs.unsubscribe();
    this.userProfileSubs.unsubscribe();
  }

  getProfileImg(event: any) {
    this.imgPath = event.target.files[0];
    this.imgcheck = true;
  }

  getWallpImg(event: any) {
    this.backgroundPath = event.target.files[0];
    this.backcheck = true
  }

  async saveFotos() {

    const profImgPath = `profiles/${this.profileId}/profile-pictures/profile${this.profileId}`;
    const wlppImgPath = `profiles/${this.profileId}/wallpaper-pictures/wallpaper${this.profileId}`;
    if (this.imgcheck == true) {
      const refProf = await this.storage.upload(profImgPath, this.imgPath);
      refProf.ref.getDownloadURL().then(url => {
        this.profileImg = url;
      });
    }
    if (this.backcheck == true) {
      const refWlpp = await this.storage.upload(wlppImgPath, this.backgroundPath);
      refWlpp.ref.getDownloadURL().then(url => {
        this.wallpImg = url;
      });
    }

  }

  loadData() {
    this.profile = this.user.getProfilePicture(this.profileId).subscribe((url: any) => {
      this.profileImg = url;
    }, (err: any) => {
      this.profileImg = this.user.profasset();
    });

    this.wallpaper = this.user.getWallpaper(this.profileId).subscribe((url: any) => {
      this.wallpImg = url;
    }, (err: any) => {
      this.wallpImg = this.user.wallpasset();
    });

    this.userSubs = this.usersServices.getProfile(this.userId).subscribe((user: any) => {

      this.userProfile = user.profileId;
      
      this.userProfileSubs = this.profileService.getProfile(user.profileId).subscribe((profile: any) => {
        this.userFollowing = profile.following;

        // Verifying if this user it's beeing followed
        if (this.btnFollow) {
          const button = this.btnFollow.nativeElement;

          button.innerHTML = this.profileService.verifyFollowing(this.profileId, this.userFollowing);

          button.hidden = false;
        }

      });
    });

  }

  onFollow() {
    try { 
      this.profileService.followProfile(this.profileId, this.userFollowing, this.userProfile);
    } catch(error) {
      console.log(error)
    }
    
  }

}
