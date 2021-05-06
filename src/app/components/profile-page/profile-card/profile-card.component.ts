import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  @Input('editMode') public editbutton: boolean = false;
  public esconder: boolean = false;
  
  @ViewChild('btnFollow') btnFollow!: ElementRef;

  public userData: { name: string, desc: string } = { name: '', desc: '' };

  public profileImg: any = "";
  public wallpImg: any = "";

  private profile!: Subscription;
  private wallpaper!: Subscription;

  private imgPath: any = "";
  private imgcheck: boolean = false;
  private backgroundPath: any = "";
  private backcheck: boolean = false;

  private profileSubs!: Subscription;
  private userSubs!: Subscription;

  private paramsSubs!: Subscription;

  constructor(
    private storage: AngularFireStorage,
    private auth: AuthService,
    private user: UsersService,
    private profileService: ProfileService,
    private usersServices : UsersService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges() {
    this.esconder = false;
  }

  ngOnDestroy() {
    this.profile.unsubscribe();
    this.wallpaper.unsubscribe();

    this.profileSubs.unsubscribe();
    this.paramsSubs.unsubscribe();
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

  async loadData() {
    const user = await this.auth.getAuth().currentUser;
    this.paramsSubs = this.route.params.subscribe((params) => {
      this.profileId = params['profid'];
      
    
      this.profileSubs = this.profileService.getProfile(this.profileId).subscribe((profile: any) => {
        this.userData = profile;

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
      
    });
  });

  }

  async onFollow() {
    const button = this.btnFollow.nativeElement;

    const buttonTxt = button.innerHTML;    

    // Executing the service method to get profile data
    await this.profileService.followProfile(this.profileId);

    if (buttonTxt == "Seguir") {
      button.innerHTML = "Seguindo";
    } else {
      button.innerHTML = "Seguir";
    }    

    /*
    // Executing the service method to get profile data
      this.profileSubs = this.profile.getProfile(this.profileId).subscribe((profile: any) => {
        
        // Passing following profiles to array
        if ( profile.following.length > 0 ){
        this.profilesFollowing = profile.following;
        }
        // In pratical terms, you "follow yourself", but not in the database, only in the attribute
        this.profilesFollowing.push(this.profileId as string);
        
        // Interating over each profile followed
        this.profilesFollowing.forEach(profile => {
          // Passing to posts attribute this profile id and an empty array
          this.feedPosts.push({ profileId: profile, posts: [] });

          
          let profileIndex = this.profilesFollowing.indexOf(profile);

          // For this profile (brought by iteration), bring its posts and add in the object array
          this.postsSubs = this.posts.listProfilePosts(profile).subscribe(profilePost => {
            this.feedPosts[profileIndex].posts = profilePost;
          });
          
        });

      });
    */
    
  }

}
