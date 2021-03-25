import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from '../interfaces/project';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';

import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class DocsService {

  private userCollection = this.store.collection<User>('Users');
  
  private docsCollection = this.store.collection<Project>('Projects');  

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

  listProject(id: string) {
    const projectRef = this.docsCollection.doc(id).snapshotChanges();

    return projectRef;
  }
  
  async addProject(project: Project) {
    const owner = await this.auth.getAuth().currentUser;

    const newDoc = await this.docsCollection.add(project);

    newDoc.update({"docId": newDoc.id});

    return newDoc;
  }

  async updateProject(id: string, project: { title: string, content: string }) {
    const updatedDoc = await this.docsCollection.doc(id).update({ title: project.title, content: project.content });

    return updatedDoc;
  }

}
