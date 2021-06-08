import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EdictsService } from 'src/app/services/edicts.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  @ViewChild('edictsList') private pBody!: ElementRef;

  public edicts: any[] = [];

  constructor(private edictsService: EdictsService) { }

  ngOnInit(): void {
    this.edictsService.listCompanyEdicts().then(data => {
      data.forEach((query) => {
        this.edicts.push(query.data());
      });

      // Ordering by date
      this.edicts.sort((a: any, b: any) => {
        return a.createdAt.seconds - b.createdAt.seconds;
      }).reverse();
    });
  }  

}
