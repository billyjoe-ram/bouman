import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'publication-card',
  templateUrl: './publication-card.component.html',
  styleUrls: ['./publication-card.component.css']
})
export class PublicationCardComponent implements OnInit {

  public publication: { name: string, content: string, interaction: string } = { name: '', content: '', interaction: ''};
  public profileImg: any = "";
  
  constructor(private user: UsersService) { }

  ngOnInit(): void {
    this.user.getCollection().then(data => {
      this.publication.name = data.name;
      this.publication.content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla at risus. Quisque purus magna, auctor et, sagittis ac, posuere eu, lectus. Nam mattis, felis ut adipiscing. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis...";
      this.publication.interaction = "compartilhou";
    });

    this.profileImg = this.user.getProfilePicture();
  }

}
