import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from '../interfaces/project';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class DocsService {

  private docsCollection = this.store.collection<Project>('Projects');
  private projects: any[] = [];
  
  constructor(private store: AngularFirestore, private user: UsersService) { }

  listProjects() {    
    const owner = this.user.getId();
    // Create a reference to the cities collection
    const projectsRef = this.docsCollection.ref;

    // Create a query against the collection.
    const query = projectsRef.where("ownerId", "==", `${owner}`);
    console.log(query);
    this.projects.push(query);
    return this.projects.slice();
  }
  
  addProject(project: Project) {
    return this.docsCollection.add(project);
  }
}
