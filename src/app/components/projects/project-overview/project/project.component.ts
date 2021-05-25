import { AfterViewInit, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DocsService } from 'src/app/services/docs.service';
import { ProjectContent } from 'src/app/interfaces/projectContent';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, AfterViewInit {

  @ViewChild('projForm') projForm!: NgForm;
  @ViewChild('articleStructure') article!: ElementRef;
  @ViewChild('modalTrigger') modalTrigger!: ElementRef;
  
  public projTitle: string = "";

  public projContent: ProjectContent = {
    aResum: "",
    bIntro: "",
    cObj: "",
    dMetod: "",
    eResult: "",
    fCons: "",
    gRef: ""
  };

  public editorText: string = "";

  public newProj: boolean = false;

  public tinyConfig = {
    height: 500,
    menubar: false,
    plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
    ],
    toolbar:
    'undo redo | formatselect | bold italic backcolor | \
    alignleft aligncenter alignright alignjustify | \
    bullist numlist outdent indent | removeformat | help',
    language: 'pt_BR',
    directionality : 'ltr'
  };

  public errorState: boolean = false;

  private projectWorkingPart: string = "";

  private contentKey: string = "";

  // private editMode: boolean = false;

  private fullProject: string = "";
  
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
    this.addEvents();
  }

  async onSubmit() {
    const user = await this.auth.getAuth().currentUser;
    const docId = this.route.snapshot.params['id'];
    const date = new Date();    

    const submitted = this.projForm.value;

    // Checking if fields don't contain only whitespaces
    if (submitted.title.trim() && submitted.content.trim()) {
      if (this.newProj) {
        // Loading object key
        const projContent = this.projectWorkingPart;
  
        // Saving content from the form value to the object
        this.projContent[projContent] = this.projForm.value.content;
  
        // Creating a new object based on the content and aditional information
        const project = { ownerId: user?.uid, title: submitted.title, content: this.projContent, createdAt: date, lastEdit: date };
  
        // Adding a project, then back to your projects
        this.docServ.addProject(project).finally(() => {
          this.myProjects();
        });
      } else {
        // Loading object key
        const projContent = this.projectWorkingPart;
  
        // Saving content from the form value to the object
        this.projContent[projContent] = this.projForm.value.content;
  
        // Updating last edit and content
        const project = { title: submitted.title, content: this.projContent, lastEdit: date };
  
        // Updating project
        this.docServ.updateProject(docId, project);
      }
    } else {
      // Displaying modal
      this.modalTrigger.nativeElement.click();
    }  
    
  }

  loadProject() {
    const docId: string = this.route.snapshot.params['id'];

    // Preventing loading in new projects
    if (!this.newProj) {
      this.docServ.listProject(docId).then((project) => {
        project.forEach(query => {
          this.projContent = query.data().content;

          this.projForm.setValue({'title': query.data().title, 'content': this.projContent });

          this.loadProjectContent()
        });
      });

      // After loading, save a copy to compare it later to see if content changed;
      this.fullProject = this.editorText;
    }
        
  }

  loadProjectPart(projPart: string): string {
    // If there's something already loaded to the content key, pass the content in the editorText to the object
    if (this.checkEditMode() && this.contentKey) {
      this.projContent[this.contentKey] = this.editorText;      
    }

    // Loading the project part selected
    switch (projPart.trim()) {
      case "Resumo":
        this.contentKey = "aResum";
      break;
      case "Introdução":
        this.contentKey = "bIntro";
      break;
      case "Objetivos":
        this.contentKey = "cObj";
      break;
      case "Metodologia":
        this.contentKey = "dMetod";
      break;
      case "Resultados":
        this.contentKey = "eResult";
      break;
      case "Considerações":
        this.contentKey = "fCons";
      break;
      case "Referências":
        this.contentKey = "gRef";
      break;
    }

    // Passing the value already saved in the object contentKey (something or empty string) to the text editor
    this.editorText = this.projContent[this.contentKey];

    // Return the value of the key
    return this.contentKey;
  }

  deleteProject() {
    const docId = this.route.snapshot.params['id'];

    this.docServ.deleteProject(docId).then(() => {
      this.myProjects();
    });
  }

  myProjects() {    
    this.router.navigate(["/projects/overview"]);
  }

  private addEvents() {
    if (this.article) {
      const list = this.article.nativeElement;
      
      const listItems = list.children;

      for (let key of listItems) {

        key.addEventListener("click", (event: any) => {
          let projPart = event.target.innerHTML;

          this.projectWorkingPart = this.loadProjectPart(projPart);
        });
      }
      
    }
  }

  private checkEditMode(): boolean {
    if (this.fullProject === this.editorText) {
      return false;
    }
    return true;
  }

  private loadProjectContent() {
    // Reseting text content
    this.editorText = "";

    // Ordering keys that were messed
    const orderedKeys = Object.keys(this.projContent).sort();

    // Creating a new Object: ProjectCotent
    const orderedObject: ProjectContent = { aResum: "", bIntro: "", cObj: "", dMetod: "", eResult: "", fCons: "", gRef: "" };

    // For each ordered key, in their order, get the value from the same key of projContent
    orderedKeys.forEach((key) => {
      orderedObject[key] = this.projContent[key]
    })

    // With the copy now ordered and populated, pass it to projContent
    this.projContent = orderedObject;

    // For each key in the project, append the content to editorText
    for (let key in this.projContent) {
      this.editorText += this.projContent[key];
    }
  }

}