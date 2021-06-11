import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Project } from 'src/app/interfaces/project';
import { ProjectContent } from 'src/app/interfaces/projectContent';
import { AreasService } from 'src/app/services/areas.service';
import { DocsService } from 'src/app/services/docs.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'post-project',
  templateUrl: './post-project.component.html',
  styleUrls: ['./post-project.component.css']
})
export class PostProjectComponent implements OnInit, OnChanges {

  @Input('projects') userProjects: Project[] = [];

  @Input('profileId') profileId: string | undefined = "";

  @Output('projectPosted') projectPosted: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('projectsModalTrigger') projectsModalTrigger!: ElementRef;

  @ViewChild('selectedProjectContent') selectedProjectContent!: ElementRef;

  @ViewChild('selectedProjectKeywords') selectedProjectKeywords!: ElementRef;

  @ViewChild('selectedProjectSubarea') selectedProjectSubarea!: ElementRef;  

  @ViewChild('checkBoxes') checkBoxes!: ElementRef;

  public selectedProjectObj: { title: string, content: string } = { title: "", content: "" };

  public selectedProjectText: string[] = [];

  public selectedProject!: any;

  public loaded: any = false;

  public userArea: { area: string, subarea: string } = { area: "", subarea: "" };

  public userSpecificSubareas: { name: string, value: string }[] = [];

  constructor(
    private projectsService: ProjectsService,
    private docsService: DocsService,
    private usersService: UsersService,
    private areasService: AreasService
  ) { }

  ngOnInit(): void {    
  }

  ngOnChanges() {
    this.loadUserAreas();
  }

  importProject() {
    this.loaded =false;
    // Reset the array
    this.userProjects = [];

    this.docsService.listProjects().then((projects) => {
      // Retrieving user projects
      projects.forEach((project) => {
        // Add to the array
        this.userProjects.push(project.data());
      });

      // Ordering by date
      this.userProjects.sort((a: any, b: any) => {
        return a.lastEdit.seconds - b.lastEdit.seconds;
      }).reverse();
    }).finally(()=>{
    this.loaded = true;
    });

    // Triggering modal
    this.projectsModalTrigger.nativeElement.click();
  }

  selectProject(project: Project) {
    this.selectedProject = project;
  }

  showProject() {
    this.addEvents();

    // Ordering keys that were messed
    const orderedKeys = Object.keys(this.selectedProject.content).sort();

    // Creating a new Object: ProjectCotent
    const orderedObject: ProjectContent = { aResum: "", bIntro: "", cObj: "", dMetod: "", eResult: "", fCons: "", gRef: "" };

    // For each ordered key, in their order, get the value from the same key of projContent
    orderedKeys.forEach((key) => {
      orderedObject[key] = this.selectedProject.content[key];
    });

    // With the copy now ordered and populated, pass it to projContent
    this.selectedProject.content = orderedObject;

  }

  loadProjectPart(projPart: string): string {
    let contentKey = projPart;

    // Loading the project part selected
    switch (projPart.trim()) {
      case "Resumo":
        contentKey = "aResum";
        break;
      case "Introdução":
        contentKey = "bIntro";
        break;
      case "Objetivos":
        contentKey = "cObj";
        break;
      case "Metodologia":
        contentKey = "dMetod";
        break;
      case "Resultados":
        contentKey = "eResult";
        break;
      case "Considerações":
        contentKey = "fCons";
        break;
      case "Referências":
        contentKey = "gRef";
        break;
    }

    // Return the value of the key
    return contentKey;
  }

  postProject() {
    const keywords: string = this.selectedProjectKeywords.nativeElement.value;

    // Creating an array separating by empty strings
    let keywordsArray = keywords.trim().split(' ');

    // Removing duplicate values
    keywordsArray = keywordsArray.filter((keyword, index) => {      
      return keywordsArray.indexOf(keyword) === index;
    });

    // Removing empty strings
    keywordsArray = keywordsArray.filter((keyword) => {
      // Cleaning up giant empty strings
      keyword = keyword.trim();

      // Returning if it isn't an empty string
      return keyword !== "";
    })

    if (keywordsArray.length) {
      if (keywordsArray.length <= 3) {

        // Saving the specific subarea name
        let specificSubarea: any = this.userSpecificSubareas.filter((specificSubarea) => {
          return specificSubarea.value == this.selectedProjectSubarea.nativeElement.value;
        });        

        // Becasuse there is only one code with that name, I can use the first index
        keywordsArray.unshift(specificSubarea[0].name);

        keywordsArray = keywordsArray.map((keyword) => {
          return keyword.toLowerCase();
        });

        const project = { title: this.selectedProject.title, content: this.selectedProjectText.join('\n'), keywords: keywordsArray };
  
        if(this.selectedProjectText.length) {
          this.projectsService.addProject(this.profileId, project);

          this.projectPosted.emit(true);
        } else {
          alert("Selecione pelo menos uma parte do projeto");
        }
      } else {
        alert("Adicione apenas até 3 palavras-chave");
      }
    } else {
      alert("Adicione pelo menos uma palavra-chave");
    }  

  }

  private addEvents() {
    // Selecting element
    const textArea = this.selectedProjectContent.nativeElement;

    // Checking if the element was created
    if (this.checkBoxes) {
      // Getting the element itself
      const checks = this.checkBoxes.nativeElement;

      // Getting its children
      const checkControls = checks.children;

      // For each .form-check, handle 
      for (let control of checkControls) {
        // Form check children
        const controlChildren = control.children;

        // Input itself
        const checkboxInput = controlChildren[0];

        // Add a callback attached to click
        checkboxInput.addEventListener("click", (event: any) => {
          // Clearing content
          textArea.innerHTML = "";

          // Event target
          let input = event.target;

          // Input label
          const checkboxLabel = input.nextElementSibling;

          // Label text
          const labelText = checkboxLabel.innerHTML;

          // Get selected working part
          const workingPart = this.loadProjectPart(labelText);

          // Verify checkbox
          if (input.checked) {
            // Add content if is checked
            this.selectedProjectText.push(this.selectedProject.content[workingPart]);
          } else {
            // Remove content if it isn't checked
            this.selectedProjectText = this.selectedProjectText.filter((element) => {
              return element !== this.selectedProject.content[workingPart];
            });
          }

          // Adding text to modal
          this.selectedProjectText.forEach(projectChapter => {
            textArea.innerHTML += projectChapter;
          });

        });
      }

    }
  }

  // Load user area / subarea from the database
  private loadUserAreas() {
    // Creating a variable to store userDID after promise is completed
    let userUID: string | undefined = "";

    // Asking for the logged user UID
    this.usersService.getUid().then((uid) => {
      // Passing this async function return to the variable
      userUID = uid;

      // Asking for the collection with this userUID
      this.usersService.getCollection(userUID).then((user) => {
        // Creating a const to make code reading more easy
        const userData: any = user.data();
  
        // Preventing attribution if data is undefined
        if (userData) {
          // Passing to a userArea object (class attribute)
          this.userArea.area = userData.area;
          this.userArea.subarea = userData.subarea;
  
          // Loading subareas to the select El
          this.loadAreasSelect();
        }
  
      });
    });
    
  }

  // Load the user area / subarea in a <select>
  private loadAreasSelect() {
    const area = this.userArea.area;

    const subarea = this.userArea.subarea;

    this.areasService.getProjectAreas(area, subarea).then((specificSubareas) => {
      this.userSpecificSubareas = specificSubareas;
    });
  }

}
