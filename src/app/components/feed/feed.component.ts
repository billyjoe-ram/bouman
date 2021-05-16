import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('modalTrigger') modalTrigger!: ElementRef;
  
  public content: string = "";

  public profilesFollowing: string[] = [];

  public profileId!: string | undefined;

  public feedPosts: { profileId: string, posts: Post[] }[] = [];

  public errorMsg: string = "";
  
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

    if (this.content.trim()) {
      try {
        const post = this.posts.addPost(this.profileId, this.content);
      } catch (err) {
        console.error(err);
      } finally {
        form.reset();
      }
    } else {
      this.handleError("Não há nada na sua postagem");
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
        if (!this.profilesFollowing.includes(this.profileId as string)) {
          this.profilesFollowing.push(this.profileId as string);
        }
      
        // Interating over each profile followed
        this.profilesFollowing.forEach(profile => {
          // Passing to posts attribute this profile id and an empty array
          this.feedPosts.push({ profileId: profile, posts: [] });

          let profileIndex = this.profilesFollowing.indexOf(profile);
          
          // For this profile (brought by iteration), bring its posts and add in the object array
          this.postsSubs = this.posts.listProfilePosts(profile).subscribe((profilePost: any) => {
            // Pushing each post object feed conten array
            this.feedPosts[profileIndex].posts = profilePost;

            // Ordering by date
            this.feedPosts[profileIndex].posts.sort((a: any, b: any) => {
              return a.publishedAt.seconds - b.publishedAt.seconds;
            }).reverse();                        
          });

          // Removing duplicates by postId
          // this.feedPosts = this.feedPosts.filter(element => {
          //   return element.postId != element.postId;
          // });

        });
      });
      
    });    
  }

  ngOnDestroy() {
    // Unsubscribing only if subscription exists
    if (this.userSubs) {
      this.userSubs.unsubscribe();
    }

    if (this.profileSubs) {
      this.profileSubs.unsubscribe();
    }

    if (this.postsSubs) {
      this.postsSubs.unsubscribe();
    }

  }

  handleError(errorMsg: string) {
    this.errorMsg = errorMsg;
    
    this.modalTrigger.nativeElement.click();
  }

}