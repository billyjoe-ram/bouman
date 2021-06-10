import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Edict } from 'src/app/interfaces/edict';
import { EdictsService } from 'src/app/services/edicts.service';
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
    private edictsService: EdictsService,
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

  async onCandidate() {
    const uid = await this.user.getUid();

    const userProfile = await this.user.getCollection(uid);
    
    if (userProfile.exists) {
      const profileId = (userProfile.data() as any).profileId      

      this.edictsService.applyToEdict(this.edict, profileId).then(() => {
        alert(`Sua candidatura foi enviada para ${this.profileName}`);
      });      
    } else {
      alert("Parece que você está tentando se candidatar com um perfil de empresa, sua conta está com dados inacessíveis ou corrompidos, ou não existe. Contate o suporte caso você seja um cientista e queira se candidatar a esse edital");
    }

  }

  ngOnDestroy() {
    this.profileSubs.unsubscribe();

    this.imageSubs.unsubscribe();
  }

}
