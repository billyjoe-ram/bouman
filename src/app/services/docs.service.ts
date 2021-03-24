import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from '../interfaces/project';
import { AuthService } from './auth.service';

import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class DocsService {

  private docsCollection = this.store.collection<Project>('Users/Projects');
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
  
  async addProject(project: Project) {
    const owner = await this.auth.getAuth().currentUser;
    /*
    try {
        const newUser = await this.authService.register(this.userRegister);        

        await this.store
          .collection('Users')
          .doc(newUser.user?.uid)
          .set(userObject);

        userObject.id = newUser.user?.uid;

        await this.store
          .collection('Users')
          .doc(newUser.user?.uid)
          .update(userObject);
    */
    const newDoc = this.docsCollection.doc(owner?.uid).set(project);
    
    const projectRef = this.docsCollection.doc(owner?.uid);

    projectRef.get().subscribe(data => {
      project.docId = data.id;
    });

    console.log(project);
    
    projectRef.update(project);
  }

}
