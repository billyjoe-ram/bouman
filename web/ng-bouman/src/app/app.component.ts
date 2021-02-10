import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public pagina: string = 'recipe';

  mudarPag(feature: string) {
    this.pagina = feature;
  }
}
