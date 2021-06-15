import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Post } from '../interfaces/posts';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private publication: Post = { content: "", profileId:"", likes: [], publishedAt: new Date() };

  private postsCollection = this.store.collection('Profiles');

  constructor(private store: AngularFirestore) { }

  async getSinglePost(post : Post){
    const posts = await this.postsCollection.doc(post.profileId).collection('Posts').doc(post.postId).ref.get();
    return (posts!=undefined || posts!= null ? posts.data(): `Houve um erro, O post agora está ${posts}`);
  }

  listProfilePosts(profileId: string) {
    const postsRef = this.postsCollection.doc(profileId).collection('Posts');
    
    const profilePosts = postsRef.ref.get();
    
    return profilePosts;
  }

  listAllPosts(profilesFollowing: string[]) {
    const posts: any[] = [];
    const postsRef = this.postsCollection.ref;

    profilesFollowing.forEach(async profile => {
      const query = await postsRef.where('profileId', '==', profile).get();

      posts.push(query);
    });

    return posts;
  }

  async addComment(userProfile: any, data: string, publication: Post) {
    let newCom: any;
    try {
      //creating the comment itself
      newCom = await this.postsCollection.doc(publication.profileId).collection('Posts').doc(publication.postId).collection('Comments').add(
        {
          profileId: userProfile,
          content: data,
          publishedAt: new Date()
        }
      );
      this.postsCollection.doc(publication.profileId).collection('Posts').doc(publication.postId).collection('Comments').doc(newCom.id).update({
        commentId: newCom.id
      })
    }
    catch (error) {
      //handling errors from the add function
      if (newCom) {
        //deletando caso ocorra um erro e ele crie o comentário, já que deu erro ele não deveria continuar lá, então eu deleto para que não de erro no HTML quotation.

        try {
          this.postsCollection.doc(publication.profileId).collection('Posts').doc(publication.postId).collection('Comments').doc(newCom.id).delete();
        } catch (error) {
          //handling errors from the delete function
          console.error(error);
        }
      }
      console.error(error);
    }
  }

  async getEachComment(commentId: any, post: Post) {
    return await this.postsCollection.doc(post.profileId).collection('Posts').doc(post.postId).collection('Comments').doc(commentId).ref.get();
  }

  async listsAllCommentsIds(pub: Post) {

    try {
      return (await this.postsCollection.doc(pub.profileId).collection('Posts').doc(pub.postId).collection('Comments').ref.get()).docs;
    } catch (error) {
      return error;
    }
  }

  async addPost(profileId: string | undefined, content: string) {
    // Going inside the profile posts
    const userPosts = this.postsCollection.doc(profileId).collection('Posts');

    // Adding a new posts
    const newPost = await userPosts.add(
      { profileId: profileId,
        content: content,
        publishedAt: new Date(),
        likes: []
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

  likePost(post: Post, profileId: string | undefined) {
    let likes: string[] = post.likes;

    // Going inside the profile posts
    const userPosts = this.postsCollection.doc(post.profileId).collection('Posts');

    if (likes.includes(profileId as string)) {
      likes = likes.filter(element => {
        return element != profileId
      });
    } else {
      likes.push(profileId as string);
    }

    // Updating a project
    const updatedProj = userPosts.doc(post.postId).update({ likes: likes });
    
    // Returning the process promise
    return updatedProj;
  }

  async searchingProfiles(input:string){
    let posts: any[] = [];
    const postsname: any[] = [];

    let i : number = 0;

    const postsResult= (await this.postsCollection.ref.orderBy("name", "asc").startAt(input.toUpperCase()+'\uf8ff').endAt(input.toLowerCase()+'\uf8ff').limit(10).get());

    postsResult.forEach(element => {
      postsname.push(element.data() as object);
      posts.push({id:element.id, name:postsname[i].name, picture: ""});
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
