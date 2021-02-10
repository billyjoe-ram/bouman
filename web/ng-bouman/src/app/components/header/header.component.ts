import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() private pagSelec = new EventEmitter<string>();
  
  public collapsed = true;
  
  constructor() { }

  ngOnInit(): void {
  }

  selecPagina(pagina: string) {
    this.pagSelec.emit(pagina);
  }

}
