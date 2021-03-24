import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  public editMode: boolean = false;
  
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  toggleComponent() {
    if (!this.editMode) {
      this.router.navigate(["/projects/edit"]);
    } else {
      this.router.navigate(["/projects/overview"]);
    }

    this.editMode = !this.editMode
  }

}
