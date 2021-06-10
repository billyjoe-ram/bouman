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

  public profileAppl: boolean = true;

  private userProfile: string = "";

  private isCompany: boolean = false;
  
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

    this.checkApplication().then((value) => {
        this.profileAppl = value;
    });
  }

  showMore() {
    this.limit = this.edict.content.length;
    this.sMDisabled = !this.sMDisabled;
  }

  onCandidate() {        
    if (!this.isCompany) {
      this.edictsService.applyToEdict(this.edict, this.userProfile).then(() => {
          let message = "";
          if (this.profileAppl) {
            message = `Sua candidatura já foi enviada para ${this.profileName}`
          } else {
            message = `Candidatura enviada com sucesso para ${this.profileName}`
          }
          alert(message);
      });      
    } else {
      alert("Parece que você está tentando se candidatar com um perfil de empresa, sua conta está com dados inacessíveis ou corrompidos, ou não existe. Contate o suporte caso você seja um cientista e queira se candidatar a esse edital");
    }

  }

  async checkApplication() {
    const uid = await this.user.getUid();

    const userProfile = await this.user.getCollection(uid);
    
    if (userProfile.exists) {
        this.isCompany = false;
        const profileId = (userProfile.data() as any).profileId;

        this.userProfile = profileId;

        if (this.edict.profilesApplied?.includes(profileId)) {
            return true;
        } else {
            return false;
        }        
    } else {        
        this.isCompany = true;
        return false;
    }
  }

  ngOnDestroy() {
    this.profileSubs.unsubscribe();

    this.imageSubs.unsubscribe();
  }

}
