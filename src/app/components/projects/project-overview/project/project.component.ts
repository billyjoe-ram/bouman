import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
    aIntro: "",
    bObj: "",
    cMetod: "",
    dResult: "",
    eCons: "",
    fRef: ""
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

    if (submitted.title.trim() && submitted.content.trim()) {
      if (this.newProj) {
        const projContent = this.projectWorkingPart;
  
        this.projContent[projContent] = this.projForm.value.content;
  
        const project = { ownerId: user?.uid, title: submitted.title, content: this.projContent, createdAt: date};
  
        this.docServ.addProject(project).then(() => {
          this.myProjects();
        });
      } else {
        const projContent = this.projectWorkingPart;
  
        this.projContent[projContent] = this.projForm.value.content;
  
        const project = { title: submitted.title, content: this.projContent };
  
        this.docServ.updateProject(docId, project);
      }
    } else {
      this.modalTrigger.nativeElement.click();
    }  
    
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

  loadProject() {
    const docId: string = this.route.snapshot.params['id'];

    // Preventing loading in new projects
    if (!this.newProj) {
      this.docServ.listProject(docId).then((project) => {
        project.forEach(query => {
          this.projContent = query.data().content;

          this.projForm.setValue({'title': query.data().title, 'content': this.projContent })
        });

        this.editorText = "";

        for (let key in this.projContent) {
          this.editorText += this.projContent[key];
        }
      });
      
    }
        
  }

  loadProjectPart(projPart: string): string {
    let contentKey: string = "";

    switch (projPart.trim()) {
      case "Introdução":
        contentKey = "aIntro";
      break;
      case "Objetivos":
        contentKey = "bObj";
      break;
      case "Metodologia":
        contentKey = "cMetod";
      break;
      case "Resultados":
        contentKey = "dResult";
      break;
      case "Considerações":
        contentKey = "eCons";
      break;
      case "Referências":
        contentKey = "fRef";
      break;
    }

    this.editorText = this.projContent[contentKey];

    return contentKey;
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

}