import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public loadedFeature: string = 'signup';
    
  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
  
}
