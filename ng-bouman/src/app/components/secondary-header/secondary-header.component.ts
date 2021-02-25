import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'secondary-header',
  templateUrl: './secondary-header.component.html',
  styleUrls: ['./secondary-header.component.css']
})
export class SecondaryHeaderComponent implements OnInit {

  @Output() returnHome = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {
  }

  onSelectHome(feature: string) {
    this.returnHome.emit(feature);
  }

}
