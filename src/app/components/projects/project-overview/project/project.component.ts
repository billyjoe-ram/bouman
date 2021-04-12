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

  public newProj: boolean = false;
  
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
      ['insertImage'],
      ['insertVideo']
    ]
};
  
  constructor(private docServ: DocsService, private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const docId = this.route.snapshot.params['id'];

    if (docId === 'new') {
      this.newProj = true;
    } else {
      this.newProj = false;
    }

    this.loadProject();
  }

  ngAfterViewInit() {    

  }

  async onSubmit() {
    const user = await this.auth.getAuth().currentUser;
    const docId = this.route.snapshot.params['id'];
    const date = new Date();

    const submitted = this.projForm.value;
    
    if (docId === 'new') {
      const project = { ownerId: user?.uid, title: submitted.title, content: submitted.content, createdAt: date};

      this.docServ.addProject(project).then(() => {
        console.log('Added');
      }).finally(() => {
        this.myProjects();
      });

    } else {
      const project = { title: submitted.title, content: submitted.content };

      this.docServ.updateProject(docId, project).then(() => {
        console.log('Saved!');
      }).finally(() => {
        this.myProjects();
      });
    }      
    
  }

  loadProject() {
    const docId: string = this.route.snapshot.params['id'];
    this.docServ.listProject(docId).then((project) => {
      project.forEach(query => {
        this.projForm.setValue({'title':query.data().title, 'content':query.data().content})
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