import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DocsService } from 'src/app/services/docs.service';

@Component({
  selector: 'project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit, AfterViewInit {

  public projects: any[] = [];

  constructor(private docServ: DocsService) { }

  ngOnInit(): void {
    this.docServ.listProjects().then(data => {
      data.forEach((query) => {
        this.projects.push(query.data());
      });

      // Ordering by date
      this.projects.sort((a: any, b: any) => {
        return a.lastEdit.seconds - b.lastEdit.seconds;
      }).reverse();
    });
  }

  ngAfterViewInit() {

    const pBody = document.querySelectorAll('.project-body');

    for (let index = 0; index < this.projects.length; index++) {
      pBody[index].innerHTML = this.projects[index].content;
    }
  }

}
