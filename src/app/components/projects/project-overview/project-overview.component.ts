import { Component, OnInit } from '@angular/core';
import { DocsService } from 'src/app/services/docs.service';

@Component({
  selector: 'project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit {

  public projects: any[] = [];
  
  constructor(private docServ: DocsService) { }

  ngOnInit(): void {
    this.docServ.listProjects().then(data => {
      data.forEach((query) => {
        this.projects.push(query.data());
      })

      // console.log(this.projects);
    });
    
    
  }

}
