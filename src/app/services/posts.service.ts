import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private postsCollection = this.store.collection('Posts');

  constructor(private store: AngularFirestore, private auth: AuthService) { }

  // ESSE CÓDIGO É APENAS PARA GUIA
  // NÃO COPIE, É APENAS PARA AUXILIAR NA LÓGICA
  // AINDA NÃO DECIDIMOS SE POSTS SERÃO SUBCOLLECTIONS OU COLLECTIONS

  // async listProjects() {
  //   const owner = await this.auth.getAuth().currentUser;
    
  //   const userCollec = this.postsCollection .doc(owner?.uid);

  //   const projectsRef = await userCollec.collection('Projects').ref;

  //   // Create a query against the collection.
  //   const query = projectsRef.where("ownerId", "==", `${owner?.uid}`).get();
  //   // console.log(query);
  //   // this.projects.push(query);
  //   return query;
  // }

  // async listProject(id: string) {
  //   const owner = await this.auth.getAuth().currentUser;

  //   const userCollec = this.postsCollection .doc(owner?.uid);

  //   const projectRef = userCollec.collection('Projects').doc(id).valueChanges();

  //   const queryRef = userCollec.collection('Projects').ref;

  //   const query = queryRef.where("docId", "==", id).get();

  //   return query;
  // }
  
  // async addProject(project: any) {
  //   const owner = await this.auth.getAuth().currentUser;

  //   const userCollec = this.postsCollection .doc(owner?.uid);

  //   const newDoc = await userCollec.collection('Projects').add(project);

  //   newDoc.update({"docId": newDoc.id});

  //   return newDoc;
  // }

  // async updateProject(id: string, project: { title: string, content: string }) {
  //   const owner = await this.auth.getAuth().currentUser;

  //   const userCollec = this.postsCollection .doc(owner?.uid);

  //   const oldDoc = userCollec.collection('Projects').doc(id);

  //   const updatedDoc = await oldDoc.update({ title: project.title, content: project.content });

  //   return updatedDoc;
  // }

  // async deleteProject(id: string) {
  //   const owner = await this.auth.getAuth().currentUser;

  //   const userCollec = this.postsCollection .doc(owner?.uid);

  //   const oldDoc = userCollec.collection('Projects').doc(id);

  //   const deletedDoc = oldDoc.delete();

  //   return deletedDoc;
  // }

}
