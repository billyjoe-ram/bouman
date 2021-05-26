import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DocsService } from 'src/app/services/docs.service';

@Component({
  selector: 'project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent implements OnInit, AfterViewInit {

  @ViewChild('projectsList') private pBody!: ElementRef;
  
  public projects: any[] = [];

  constructor(private docServ: DocsService) { }

  ngOnInit(): void {
    this.docServ.listProjects().then(data => {
      console.log(data);
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
    // Creating constant only after it's been created
    if (this.pBody) {
      // Acessing element itself
      const pBody = this.pBody.nativeElement;

      // For eacth project, append to the list
      for (let index = 0; index < this.projects.length; index++) {
        pBody[index].innerHTML = this.projects[index].content;
      }
    }    
  }

}
