import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/interfaces/project';
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
    this.projects = this.docServ.listProjects();

    console.log(this.projects);
  }

}
