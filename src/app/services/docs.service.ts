import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from '../interfaces/project';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DocsService {

  // Path to users collection
  private usersCollection = this.store.collection<User>('Users');

  // Importing modules and services
  constructor(private store: AngularFirestore, private auth: AuthService) { }

  // List projects acording to the logged user
  async listProjects() {
    // Current user object
    const owner = await this.auth.getAuth().currentUser;
    
    // Retrieving the doc with this user uid
    const userCollec = this.usersCollection.doc(owner?.uid);

    // Creating a ref
    const projectsRef = await userCollec.collection<Project>('Projects').ref;

    // Create a query against the collection.
    const query = projectsRef.where("ownerId", "==", `${owner?.uid}`).get();
    
    return query;
  }

  // List one specific project
  async listProject(id: string) {
    // Current user object
    const owner = await this.auth.getAuth().currentUser;

    // Retrieving the doc with this user uid
    const userCollec = this.usersCollection.doc(owner?.uid);

    // Retrieving the doc observable
    const projectRef = userCollec.collection<Project>('Projects').doc(id).valueChanges();

    // Creating a reference to thihs doc
    const queryRef = userCollec.collection<Project>('Projects').ref;

    // avoiding that a document saved wrong (not from the user comes)
    const query = queryRef.where("docId", "==", id).get();

    // Returning that query
    return query;
  }
  
  // Add a project to your user's subcollection
  async addProject(project: Project) {
    // Current user object
    const owner = await this.auth.getAuth().currentUser;

    // Retrieving the doc with this user uid
    const userCollec = this.usersCollection.doc(owner?.uid);

    // Adding the project to the subcollection
    const newDoc = await userCollec.collection<Project>('Projects').add(project);

    // Creating a new field with this added doc id, for consulting
    newDoc.update({ "docId": newDoc.id });

    // Returning for if the code needs some more information
    return newDoc;
  }

  // Update a project in your user's subcollection
  async updateProject(id: string, project: { title: string, content: string }) {
    // Current user object
    const owner = await this.auth.getAuth().currentUser;

    // Retrieving the doc with this user uid
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
