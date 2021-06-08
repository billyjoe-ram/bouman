import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
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

  @Input('projsSize') public projsSize: number = 0;
  @Input('publicSize') public publicSize: number = 0;

  @Output('content') public content: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('btnFollow') btnFollow!: ElementRef;

  public esconder: boolean = false;

  public profileImg: any = "";
  public wallpImg: any = "";

  public isCompany: boolean | undefined = undefined;

  private userProfile: string = "";
  private userFollowing: string[] = [];

  private checkorder: number = 0;

  private profile!: Subscription;
  private wallpaper!: Subscription;

  private imgPath: any = "";
  private imgcheck: boolean = false;
  private backgroundPath: any = "";
  private backcheck: boolean = false;

  private userSubs!: Subscription;
  private userProfileSubs!: Subscription;

  constructor(
    private storage: AngularFireStorage,    
    private user: UsersService,
    private profileService: ProfileService,
    private usersServices: UsersService
  ) { }

  ngOnInit(): void { }

  ngOnChanges() {
    this.esconder = false;

    if (this.profileId) {
      // Loading profile data
      this.loadData().then(() => { this.checkProfile(); });
    }

  }

  ngOnDestroy() {
    this.profile.unsubscribe();
    this.wallpaper.unsubscribe();

    this.userSubs.unsubscribe();
    this.userProfileSubs.unsubscribe();
  }

  loadPhoto(file: any, type: any) {
    const reader = new FileReader();
    reader.addEventListener('load', (evento) => {
      if (type == 'profile') {
        this.profileImg = evento.target?.result;
      }
      if (type == 'background') {
        this.wallpImg = evento.target?.result;
      }

    });
    reader.readAsDataURL(file);
  }

  getProfileImg(event: any) {
    this.imgPath = event.target.files[0];
    this.imgcheck = true;
    // Check if the file is an image.
    if (this.imgPath.type && !this.imgPath.type.startsWith('image/')) {
      console.log('File is not an image.', this.imgPath.type, this.imgPath);
      return;
    }
    this.loadPhoto(this.imgPath, 'profile');
  }

  getWallpImg(event: any) {
    this.backgroundPath = event.target.files[0];
    this.backcheck = true;
    if (this.backgroundPath.type && !this.backgroundPath.type.startsWith('image/')) {
      console.log('File is not an image.', this.imgPath.type, this.imgPath);
      return;
    }
    this.loadPhoto(this.backgroundPath, 'background');
  }

  async saveFotos() {
    this.checkorder++;
    if (this.checkorder == 1) {
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
      this.checkorder = 0;
    }
  }

  async loadData() {
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

    this.userSubs = (await this.usersServices.getProfile(this.userId)).subscribe((user: any) => {

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
    } catch (error) {
      console.error(error)
    }

  }

  listPosts() {
    this.content.emit("posts");
  }

  listProjects() {
    this.content.emit("projects");
  }

  private async checkProfile() {
    const checkCompany = await this.usersServices.checkusercompany(this.userId);
    if (checkCompany === "Companies") {
      this.isCompany = true;
    } else {
      this.isCompany = false;
    }
  }

}
