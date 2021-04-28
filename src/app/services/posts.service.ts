import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Post } from '../interfaces/posts';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private publication: {profileId: string, content: string} = { profileId:"", content:"" };

  private postsCollection = this.store.collection('Profiles');

  constructor(private store: AngularFirestore, private ProfileService: ProfileService) { }

  listProfilePosts(profileId: string) {
    const postsRef = this.postsCollection.doc(profileId).collection('Posts');
    
    const profilePosts = postsRef.valueChanges();
    
    return profilePosts;
  }

  listAllPosts(profilesFollowing: string[]) {
    const posts: any[] = [];
    const postsRef = this.postsCollection.ref;

    profilesFollowing.forEach(async profile => {
      const query = await postsRef.where('profileId', '==', profile).get();

      posts.push(query);
    })

    console.log(posts);

    return posts;
  }

  addPost(profileId: string | undefined, content: Post) {
    // Going inside the profile posts
    const userPosts = this.postsCollection.doc(profileId).collection('Posts');

    // Adding a new posts
    const newPost = userPosts.add({ profileId: profileId, content: content, publishedAt: new Date() });

    // Returning the process promise
    return newPost;
  }

  deleteProject(profileId: string | undefined, postId: string) {
    // Going inside the profile posts
    const userPosts = this.postsCollection.doc(profileId).collection('Posts');

    // Deleting a project
    const deletedProj = userPosts.doc(postId).delete();
    
    // Returning the process promise
    return deletedProj;
  }

  async searchingprofiles(input:string){
    const posts: any[] = [];
    const postsname: any[] = [];
    var i : number = 0;
    const postsResult= (await this.postsCollection.ref.orderBy('name').startAt(input.toUpperCase()).endAt(input.toLowerCase+'\uf8ff').limit(10).get());
    postsResult.forEach(element=>{
      postsname.push(element.data() as object);
      posts.push({id:element.id, name:postsname[i].name});
      i++;
      })
  return posts;
  }
}
