import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'publication-card',
  templateUrl: './publication-card.component.html',
  styleUrls: ['./publication-card.component.css']
})
export class PublicationCardComponent implements OnInit {

  @Input('publication') public publication: { content: string, createdAt: Date } = { content: "", createdAt: new Date()};

  @Input('profileId') public profileId: string = "";

  public profile: any = "";  

  public profileImg: any = "";

  private profileSubs!: Subscription;
  
  constructor(private user: ProfileService) { }

  ngOnInit(): void {
    this.profileSubs = this.user.getProfile(this.profileId).subscribe((collec: any) => {
      this.profile = collec.name;
    });

    // this.profileImg = this.user.getProfilePicture();
  }

  ngOnDestroy() {
    this.profileSubs.unsubscribe();
  }

}
