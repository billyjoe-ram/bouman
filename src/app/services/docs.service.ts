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
  private profilesCollection = this.store.collection<User>('Profiles');

  // Importing modules and services
  constructor(private store: AngularFirestore, private auth: AuthService, private userService: UsersService) { }

  // List projects acording to the logged user
  async listProjects() {
    // Current user object
    const owner = await this.auth.getAuth().currentUser;
    
    // Retrieving the doc with this user uid
    const userCollec = await this.userService.getCollection(owner?.uid);

    const profileId = (userCollec.data() as any).profileId;

    // Retrieving the doc with this user uid
    const profileCollec = this.profilesCollection.doc(profileId);

    // Creating a ref
    const projects = await profileCollec.collection<Project>('Projects').ref.get();
    
    return projects;
  }

  // List one specific project
  async listProject(id: string) {
    // Current user object
    const owner = await this.auth.getAuth().currentUser;

    const userCollec = await this.userService.getCollection(owner?.uid);

    const profileId = (userCollec.data() as any).profileId;

    // Retrieving the doc with this user uid
    const profileCollec = this.profilesCollection.doc(profileId);

    // Creating a reference to this doc
    const queryRef = profileCollec.collection<Project>('Projects').ref.doc(id).get();

    // Returning that query
    return queryRef;
  }
  
  // Add a project to your user's subcollection
  async addProject(project: Project) {
    // Current user object
    const owner = await this.auth.getAuth().currentUser;

    const userCollec = await this.userService.getCollection(owner?.uid);

    const profileId = (userCollec.data() as any).profileId;

    // Retrieving the doc with this user uid
    const profileCollec = this.profilesCollection.doc(profileId); 

    // Adding the project to the subcollection
    const newDoc = await profileCollec.collection<Project>('Projects').add(project);

    // Creating a new field with this added doc id, for consulting
    newDoc.update({ "docId": newDoc.id });
    
    return newDoc;
  }

  // Update a project in your user's subcollection
  async updateProject(id: string, project: { title: string, content: ProjectContent, lastEdit: Date }) {
    // Current user object
    const owner = await this.auth.getAuth().currentUser;

    const userCollec = await this.userService.getCollection(owner?.uid);

    const profileId = (userCollec.data() as any).profileId;

    // Retrieving the doc with this user uid
    const profileCollec = this.profilesCollection.doc(profileId);

    const oldDoc = profileCollec.collection<Project>('Projects').doc(id);

    const updatedDoc = oldDoc.update({ title: project.title, content: project.content, lastEdit: project.lastEdit });

    return updatedDoc;
  }

  addProfileToProject(project: Project, profileId: string) {
    const projectsCollection = this.profilesCollection.doc(project.ownerId)
    .collection<Project>('Projects').doc(project.docId);

    let projectMembers = project.members;

    if (!projectMembers.includes(profileId)) {
      projectMembers.push(profileId);
    } else {
      projectMembers = projectMembers.filter((member) => {
        return member !== profileId;
      });
    }

    console.log(projectMembers);

    const updatedDoc = projectsCollection.update({ members: projectMembers })

    return updatedDoc;
  }

  async deleteProject(id: string) {
    const owner = await this.auth.getAuth().currentUser;

    const userCollec = this.profilesCollection.doc(owner?.uid);

    const oldDoc = userCollec.collection<Project>('Projects').doc(id);

    const deletedDoc = oldDoc.delete();

    return deletedDoc;
  }

}
