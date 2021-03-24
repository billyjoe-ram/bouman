import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from '../interfaces/project';
import { AuthService } from './auth.service';

import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class DocsService {

  private docsCollection = this.store.collection<Project>('Projects');
  private projects: any[] = [];

  constructor(private store: AngularFirestore, private auth: AuthService) { }

  async listProjects() {
    const owner = await this.auth.getAuth().currentUser;
    // Create a reference to the cities collection
    const projectsRef = this.docsCollection.ref;

    // Create a query against the collection.
    const query = projectsRef.where("ownerId", "==", `${owner?.uid}`).get();
    // console.log(query);
    // this.projects.push(query);
    return query;
  }
  
  addProject(project: Project) {
    return this.docsCollection.add(project);
  }

}
