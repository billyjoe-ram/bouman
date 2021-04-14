import { Component, OnDestroy, OnInit} from '@angular/core';
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

  private profile!: Subscription;
  private wallpaper!: Subscription;
  private profileId: string = "";

  private imgPath: any = "";
  private imgcheck: boolean = false;
  private backgroundPath: any = "";
  private backcheck: boolean = false;

  private profileSubs!: Subscription;
  private userSubs!: Subscription;

  constructor(
    private storage: AngularFireStorage,
    private auth: AuthService,
    private user: UsersService,
    private profileService: ProfileService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.getData();
    // usando o service de usuario para pegar as imagens

    this.user.getProfilePicture().then((url: any) => {
      this.profile = url.subscribe((profP: any) => {
        this.profileImg = profP;
      }, (err: any) => {
        this.profileImg = this.user.profasset();
      });      
    });

    this.user.getWallpaper().then((url: any) => {
      this.wallpaper = url.subscribe((wallP: any) => {
        this.wallpImg = wallP;
      }, (err: any) => {
        this.wallpImg = this.user.wallpasset();
      })      
    });
  }

  ngOnDestroy() {
    this.profile.unsubscribe();
    this.wallpaper.unsubscribe();

    this.profileSubs.unsubscribe();
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
    const user = await this.auth.getAuth().currentUser;

    const profImgPath = `profile-pictures/${user?.uid}`;
    const wlppImgPath = `wallpaper-pictures/${user?.uid}`;
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

  async getData() {
    this.profileId = this.route.snapshot.params['profid'];

    this.profileSubs = this.profileService.getProfile(this.profileId).subscribe((profile: any) => {
      this.userData = profile;
    });
  }

}
