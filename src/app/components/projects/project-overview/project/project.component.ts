import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/interfaces/project';
import { AuthService } from 'src/app/services/auth.service';
import { DocsService } from 'src/app/services/docs.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, AfterViewInit, OnDestroy {

  public docForm!: FormGroup;

  private docSubs!: Subscription;
  
  constructor(private docServ: DocsService, private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.docForm = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.minLength(1)]),
      'content': new FormControl(null, [Validators.required, Validators.minLength(1)])
    });

    this.loadProject();
  }

  ngAfterViewInit() {    
    console.log(this.docForm.value);
  }

  ngOnDestroy() {
    this.docSubs.unsubscribe();
  }

  async onSubmit() {
    const docId = this.route.snapshot.params['id'];

    const submitted = this.docForm.value;            
    const project = { title: submitted.title, content: submitted.content };
    
    this.docServ.updateProject(docId, project).then(() => {
      console.log('Saved!');
    });

    this.myProjects();
  }

  loadProject() {
    const docId: string = this.route.snapshot.params['id'];

    const formData = this.docForm.value;

    console.log(docId);

    this.docSubs = this.docServ.listProject(docId).subscribe(project => {
      console.log(project);

      formData.title = project?.title;
      formData.content = project?.content;

      console.log(formData);
    });
  }

  deleteProject() {
    const docId = this.route.snapshot.params['id'];

    this.docServ.deleteProject(docId).then(() => {
      console.log('Deleted!');
    });

    this.myProjects();
  }

  myProjects() {    
    this.router.navigate(["/projects/overview"]);
  }

}
