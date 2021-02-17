import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sign-infos',
  templateUrl: './infos.component.html',
  styleUrls: ['./infos.component.css']
})
export class InfosComponent implements OnInit {

  @Output() signSwitch = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {
  }

  onSelect(state: string) {
    this.signSwitch.emit(state);
  }

}
