import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() featureSelected = new EventEmitter<string>();
  
  collapsed = true;
  
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }

  logOut(){
    this.authService.logout();
  }
}
