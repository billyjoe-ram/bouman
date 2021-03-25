import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { DocsService } from 'src/app/services/docs.service';

@Component({
  selector: 'project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit, AfterViewChecked {
  
  public projects: any[] = [];
  
  constructor(private docServ: DocsService) { }

  ngOnInit(): void {
    this.docServ.listProjects().then(data => {
      data.forEach((query) => {
        this.projects.push(query.data());
      });
    });
    
  }

  ngAfterViewChecked() {
    const pBody = document.querySelectorAll('.project-body');

    for(let index = 0; index < this.projects.length; index++) {
      pBody[index].innerHTML = this.projects[index].content;
    }
    
  }

}
