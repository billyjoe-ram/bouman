import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.css']
})
export class AddPeopleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onAdd() {
    console.log("Add people clicked");
  }

}
