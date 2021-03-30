import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from '../interfaces/project';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DocsService {

  private usersCollection = this.store.collection<User>('Users');

  constructor(private store: AngularFirestore, private auth: AuthService) { }

  async listProjects() {
    const owner = await this.auth.getAuth().currentUser;
    
    const userCollec = this.usersCollection.doc(owner?.uid);

    const projectsRef = await userCollec.collection<Project>('Projects').ref;

    // Create a query against the collection.
    const query = projectsRef.where("ownerId", "==", `${owner?.uid}`).get();
    // console.log(query);
    // this.projects.push(query);
    return query;
  }

  async listProject(id: string) {
    const owner = await this.auth.getAuth().currentUser;

    const userCollec = this.usersCollection.doc(owner?.uid);

    const projectRef = userCollec.collection<Project>('Projects').doc(id).valueChanges();

    const queryRef = userCollec.collection<Project>('Projects').ref;

    const query = queryRef.where("docId", "==", id).get();

    return query;
  }
  
  async addProject(project: Project) {
    const owner = await this.auth.getAuth().currentUser;

    const userCollec = this.usersCollection.doc(owner?.uid);

    const newDoc = await userCollec.collection<Project>('Projects').add(project);

    newDoc.update({"docId": newDoc.id});

    return newDoc;
  }

  async updateProject(id: string, project: { title: string, content: string }) {
    const owner = await this.auth.getAuth().currentUser;

    const userCollec = this.usersCollection.doc(owner?.uid);

    const oldDoc = userCollec.collection<Project>('Projects').doc(id);

    const updatedDoc = await oldDoc.update({ title: project.title, content: project.content });

    return updatedDoc;
  }

  async deleteProject(id: string) {
    const owner = await this.auth.getAuth().currentUser;

    const userCollec = this.usersCollection.doc(owner?.uid);

    const oldDoc = userCollec.collection<Project>('Projects').doc(id);

    const deletedDoc = oldDoc.delete();

    return deletedDoc;
  }

}
