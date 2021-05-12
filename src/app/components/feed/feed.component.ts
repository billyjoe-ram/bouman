import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/interfaces/posts';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {

  public content: any;

  public profilesFollowing: string[] = [];

  public feedPosts: Post[] = [];

  public profileId!: string | undefined;

  private userSubs!: Subscription;

  private profileSubs!: Subscription;

  private postsSubs!: Subscription;

  constructor(
    private auth: AuthService,
    private posts: PostsService,
    private user: UsersService,
    private profile: ProfileService) { }

  ngOnInit(): void {
    this.loadData();
  }

  createPost(form: NgForm) {
    try {
      const post = this.posts.addPost(this.profileId, this.content);
    } catch (err) {
      console.error(err);
    } finally {
      form.reset();
    }
  }

  async loadData() {
    // Awaiting current user id for profile id
    const user = await this.auth.getAuth().currentUser;

    // Subscribing to current user to get the profileId
    this.userSubs = this.user.getProfile(user?.uid).subscribe((user: any) => {

      // Passing to attribute
      this.profileId = user.profileId;

      // Executing the service method to get profile data
      this.profileSubs = this.profile.getProfile(this.profileId).subscribe((profile: any) => {

        // Passing following profiles to array
        if (profile.following.length > 0) {
          this.profilesFollowing = profile.following;
        }

        // In pratical terms, you "follow yourself", but not in the database, only in the attribute
        this.profilesFollowing.push(this.profileId as string);

        // Interating over each profile followed
        this.profilesFollowing.forEach(profile => {
          
          // For this profile (brought by iteration), bring its posts and add in the object array
          this.postsSubs = this.posts.listProfilePosts(profile).subscribe((profilePost: any) => {
            // Pushing each post object feed conten array
            this.feedPosts.push(...(profilePost as Post[]));

            // Ordering by date
            this.feedPosts.sort((a: any, b: any) => {

              return a.publishedAt.seconds - b.publishedAt.seconds;
            }).reverse();
          });

          // Removing duplicates by postId
          this.feedPosts = this.feedPosts.filter(element => {
            return element.postId != element.postId;
          });

        });
        
      });
      
    });    
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();

    this.profileSubs.unsubscribe();

    this.postsSubs.unsubscribe();
  }

}