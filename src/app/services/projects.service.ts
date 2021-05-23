import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { PostedProject } from '../interfaces/postedProject';
import { Post } from '../interfaces/posts';
import { Project } from '../interfaces/project';
import { ProjectContent } from '../interfaces/projectContent';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private project!: PostedProject;

  private profilesCollection = this.store.collection('Profiles');

  constructor(private store: AngularFirestore) { }

  listProfileProjects(profileId: string) {
    const projectsRef = this.profilesCollection.doc(profileId).collection('Projects');
    
    const profileProjects = projectsRef.ref.get();
    
    return profileProjects;
  }

  listAllProjects(profilesFollowing: string[]) {
    const projects: any[] = [];
    const projectsRef = this.profilesCollection.ref;

    profilesFollowing.forEach(async profile => {
      const query = await projectsRef.where('profileId', '==', profile).get();

      projects.push(query);
    });

    return projects;
  }

  async addProject(profileId: string | undefined, project: { title: string, content: string, keywords: string[] }) {
    // Going inside the profile projects
    const userProjects = this.profilesCollection.doc(profileId).collection<PostedProject>('Projects');

    // Adding a new projects
    const newProject = await userProjects.add(
      {
        title: project.title,
        profileId: profileId,
        content: project.content,
        publishedAt: new Date(),
        likes: [],
        keywords: project.keywords
      });

    const postedProject = newProject.update({ projectId: newProject.id });

    // Returning the process promise
    return postedProject;
  }

  deleteProject(profileId: string | undefined, projectId: string) {
    // Going inside the profile projects
    const userProjects = this.profilesCollection.doc(profileId).collection('Projects');

    // Deleting a project
    const deletedProj = userProjects.doc(projectId).delete();
    
    // Returning the process promise
    return deletedProj;
  }

  likeProject(project: PostedProject, profileId: string | undefined) {
    let likes: string[] = project.likes;

    // Going inside the profile projects
    const userPosts = this.profilesCollection.doc(project.profileId).collection('Projects');

    if (likes.includes(profileId as string)) {
      likes = likes.filter(element => {
        return element != profileId
      });
    } else {
      likes.push(profileId as string);
    }

    // Updating a project
    const updatedProj = userPosts.doc(project.projectId).update({ likes: likes });
    
    // Returning the process promise
    return updatedProj;
  }

}
