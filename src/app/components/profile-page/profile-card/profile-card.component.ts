import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class ProfileCardComponent implements OnInit, OnDestroy {

  public esconder: boolean = false;

  public userData: { name: string, desc: string } = { name: '', desc: '' };

  public profileImg: any = "";
  public wallpImg: any = "";
  public editbutton : boolean = false;

  private profile!: Subscription;
  private wallpaper!: Subscription;
  private profileId: string = "";

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

    // finalmente, alterando o estado do booleano
    this.esconder = !this.esconder;

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

        const profid = this.usersServices.getProfile(user?.uid).subscribe((data : any)=>{
        console.log(data);
        if (this.profileId == data.profileId)
        {
          this.editbutton = true;
        }
        else {
          this.editbutton = false;
        }
        this.esconder = false;
      });
    });
  });

  }

}
