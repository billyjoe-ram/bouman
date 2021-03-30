import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/interfaces/project';
import { AuthService } from 'src/app/services/auth.service';
import { DocsService } from 'src/app/services/docs.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, AfterViewInit {

  @ViewChild('projForm') projForm!: NgForm;
  
  public projTitle: string = "";

  public projContent: string = "";
  
  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};
  
  constructor(private docServ: DocsService, private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {    
    this.loadProject();
  }

  async onSubmit() {
    const docId = this.route.snapshot.params['id'];

    const submitted = this.projForm.value;            
    const project = { title: submitted.title, content: submitted.content };
    
    this.docServ.updateProject(docId, project).then(() => {
      console.log('Saved!');
    }).finally(() => {
      this.myProjects();
    });
    
  }

  loadProject() {
    const docId: string = this.route.snapshot.params['id'];

    // const formData = this.docForm.value;

    this.docServ.listProject(docId).then((project) => {
      project.forEach(query => {
        this.projForm.value.title = query.data().title;
        this.projForm.value.content = query.data().content;
        console.log(this.projForm)
      });
    });
  }

  deleteProject() {
    const docId = this.route.snapshot.params['id'];

    this.docServ.deleteProject(docId).then(() => {
      console.log('Deleted!');
    }).finally(() => {
      this.myProjects();
    });;    
  }

  myProjects() {    
    this.router.navigate(["/projects/overview"]);
  }

}
