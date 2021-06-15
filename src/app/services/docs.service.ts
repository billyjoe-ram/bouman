import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Project } from '../interfaces/project';
import { ProjectContent } from '../interfaces/projectContent';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class DocsService {

  // Path to profiles collection  
  private projectsCollection = this.store.collection<Project>('Projects');

  // Importing modules and services
  constructor(private store: AngularFirestore, private auth: AuthService, private userService: UsersService) { }

  // List projects acording to the logged user
  async listProjects() {
    // Current user object
    const owner = await this.auth.getAuth().currentUser;
    
    // Retrieving the doc with this user uid
    const userCollec = await this.userService.getCollection(owner?.uid);

    const profileId = (userCollec.data() as any).profileId;

    // Creating a ref
    const projects = this.projectsCollection.ref;

    // Creating a query
    const query = projects.where("members", 'array-contains', profileId).get();
    
    return query;
  }

  // List one specific project
  listProject(id: string) {
    // Creating a reference to this doc
    const queryRef = this.projectsCollection.ref.doc(id).get();

    // Returning that query
    return queryRef;
  }
  
  // Add a project to your user's subcollection
  async addProject(project: Project) {
    // Adding the project to the subcollection
    const newDoc = await this.projectsCollection.add(project);

    // Creating a new field with this added doc id, for consulting
    newDoc.update({ "docId": newDoc.id });
    
    return newDoc;
  }

  // Update a project in your user's subcollection
  async updateProject(id: string, project: { title: string, content: ProjectContent, lastEdit: Date }) {
    const oldDoc = this.projectsCollection.doc(id);

    const updatedDoc = oldDoc.update({ title: project.title, content: project.content, lastEdit: project.lastEdit });

    return updatedDoc;
  }

  addProfileToProject(project: Project, profileId: string) {
    const projectCollection = this.projectsCollection.doc(project.docId);

    let projectMembers = project.members;

    if (!projectMembers.includes(profileId)) {
      projectMembers.push(profileId);
    } else {
      projectMembers = projectMembers.filter((member) => {
        return member !== profileId;
      });
    }

    const updatedDoc = projectCollection.update({ members: projectMembers })

    return updatedDoc;
  }

  async deleteProject(id: string) {
    const oldDoc = this.projectsCollection.doc(id);

    const deletedDoc = oldDoc.delete();

    return deletedDoc;
  }

}
