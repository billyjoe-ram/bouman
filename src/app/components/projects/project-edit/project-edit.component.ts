import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from 'src/app/interfaces/project';
import { AuthService } from 'src/app/services/auth.service';
import { DocsService } from 'src/app/services/docs.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {

  public docForm!: FormGroup;
  
  constructor(private docServ: DocsService, private auth: AuthService) { }

  ngOnInit(): void {
    this.docForm = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.minLength(1)]),
      'content': new FormControl(null, [Validators.required, Validators.minLength(1)])
    });
  }

  async onSubmit() {
    const user = await this.auth.getAuth().currentUser;
    const submitted = this.docForm.value;
    const date = new Date();
        
    const project: Project = { ownerId: user?.uid, title: submitted.title, content: submitted.content, createdAt: date };
    
    this.docServ.addProject(project);
  }

}
