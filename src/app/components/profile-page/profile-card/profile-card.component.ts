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
    // Getting current user uid
    const user = await this.auth.getAuth().currentUser;

    const button = this.btnFollow.nativeElement;

    const buttonTxt = button.innerHTML;

    // Executing the service method to get profile data
    const following = await this.profileService.followProfile(this.profileId);

    this.userSubs = this.usersServices.getProfile(user?.uid).subscribe((profile: any) => {      
      const userProfileId = profile.profileId;

      // Getting current user following array
      const updateProfile = this.profileService.getProfile(userProfileId).subscribe((profile: any) => {
        // Creating a copy from this array        
        const profilesFollowing: any[] = profile.following
        
        // Checking if already followed
        if (!profilesFollowing.includes(this.profileId)) {
          button.innerHTML = "Seguir";
        } else {
          button.innerHTML = "Seguindo";
        }
        
      });
    })

  }
}
