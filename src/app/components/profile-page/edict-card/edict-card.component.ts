import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Edict } from 'src/app/interfaces/edict';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'edict-card',
  templateUrl: './edict-card.component.html',
  styleUrls: ['./edict-card.component.css']
})
export class EdictCardComponent implements OnInit {

  @Input('edict') public edict: any = {
    title: "",
    profilesApplied: [],
    createdAt: new Date(),
    content: "",
    edictId: "",
    companyId: ""
  };  

  @Input('profileId') public profileId!: string;

  public profileName: any = "";  

  public profileImg: string = "";

  public sMDisabled: boolean = false;

  public limit: number = 286;

  private profileSubs!: Subscription;

  private imageSubs!: Subscription;
  
  constructor(
    private user: UsersService,
    private profile: ProfileService,
  ) { }

  ngOnInit(): void {
    if (this.edict.content.length < this.limit) {
      this.sMDisabled = true;
    }

    this.profileSubs = this.profile.getProfile(this.profileId).subscribe((collec: any) => {
      this.profileName = collec.name;
    });

    this.imageSubs = this.user.getProfilePicture(this.profileId).subscribe(image => {
      this.profileImg = image;
    }, (error) => {
      this.profileImg = this.user.profasset();
    });
  }

  showMore() {
    this.limit = this.edict.content.length;
    this.sMDisabled = !this.sMDisabled;
  }

  ngOnDestroy() {
    this.profileSubs.unsubscribe();

    this.imageSubs.unsubscribe();
  }

}
