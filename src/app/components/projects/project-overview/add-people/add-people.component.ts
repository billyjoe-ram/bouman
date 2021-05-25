import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.css']
})
export class AddPeopleComponent implements OnInit {

  public userProfilesFollowed: string[] = [];
  
  constructor() { }

  ngOnInit(): void {
    this.loadProfileFollowers();
  }

  onProfilesSelected() {
    console.log("People selected");
  }

  private loadProfileFollowers() {
    console.log("Profiles followed:\n", this.userProfilesFollowed);
  }

}
