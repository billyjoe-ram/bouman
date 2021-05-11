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

  async addPost(profileId: string | undefined, content: Post) {
    // Going inside the profile posts
    const userPosts = this.postsCollection.doc(profileId).collection('Posts');

    // Adding a new posts
    const newPost = await userPosts.add(
      { profileId: profileId,
        content: content,
        publishedAt: new Date(),
        likes: 0
      });

    const post = newPost.update({ postId: newPost.id });

    // Returning the process promise
    return post;
  }

  deletePost(profileId: string | undefined, postId: string) {
    // Going inside the profile posts
    const userPosts = this.postsCollection.doc(profileId).collection('Posts');

    // Deleting a project
    const deletedProj = userPosts.doc(postId).delete();
    
    // Returning the process promise
    return deletedProj;
  }

  likePost(profileId: string | undefined, postId: string) {
    // Going inside the profile posts
    console.log("Can't like projet " + postId + " rigth now, " + profileId);
  }

  async searchingProfiles(input:string){
    let posts: any[] = [];
    const postsname: any[] = [];

    let i : number = 0;

    const postsResult= (await this.postsCollection.ref.orderBy("name", "asc").startAt(input.toUpperCase()+'\uf8ff').endAt(input.toLowerCase()+'\uf8ff').limit(10).get());

    postsResult.forEach(element => {
      postsname.push(element.data() as object);
      posts.push({id:element.id, name:postsname[i].name});
      i++;
    });

    // Filtering this array
    posts = posts.filter((element: any) => {    
      // Converting each element from array to lower string
      let elementLower = element.name.toLowerCase()

      // Converting search values to lower case
      let searchLower = input.toLowerCase();

      return elementLower.startsWith(searchLower);
    });

    return posts;
  }
}
