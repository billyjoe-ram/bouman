import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/interfaces/project';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { UsersService } from 'src/app/services/users.service';
import { DocumentData } from '@angular/fire/firestore';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {

  @ViewChild('errorModalTrigger') errorModalTrigger!: ElementRef;
  
  // @ViewChild('projectsModalTrigger') projectsModalTrigger!: ElementRef;
  
  public content: string = "";

  public profilesFollowing: string[] = [];

  public profileId!: string | undefined;

  public feedPosts: { data: DocumentData, type: string }[] = [];

  public userProjects: Project[] = [];

  public errorMsg: string = "";
  
  private userSubs!: Subscription;

  private profileSubs!: Subscription;

  private postsSubs!: Subscription;

  private docSubs!: Subscription;

  constructor(
    private auth: AuthService,
    private posts: PostsService,
    private user: UsersService,
    private profile: ProfileService,
    private projectsService: ProjectsService) { }

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
    this.user.getCollection(user?.uid).then((user: any) => {
      // Passing to attribute
      this.profileId = user.data().profileId;

      // Executing the service method to get profile data
      this.profile.getProfilePromise(this.profileId).then((profile: any) => {

        const profileData = profile.data()

        // Passing following profiles to array
        if (profileData.following.length > 0) {
          this.profilesFollowing = profileData.following;
        }

        // In pratical terms, you "follow yourself", but not in the database, only in the attribute
        if (!this.profilesFollowing.includes(this.profileId as string)) {
          this.profilesFollowing.push(this.profileId as string);
        }
      
        // Interating over each profile followed
        this.profilesFollowing.forEach(profile => {
          
          // For this profile (brought by iteration), bring its posts and add in the object array
          this.posts.listProfilePosts(profile).then((profilePosts) => {
            // Pushing each post object feed content array
            profilePosts.forEach(query => {              
              this.feedPosts.push({ data: query.data(), type: 'post' } as any);
            });
          });

          this.projectsService.listProfileProjects(profile).then((postedProject) => {
            postedProject.forEach((query) => {
              this.feedPosts.push({ data: query.data(), type: 'project' } as any);
            });

            // Ordering by date
            this.feedPosts.sort((a: any, b: any) => {
              const aDate = a.data.publishedAt;
              const bDate = b.data.publishedAt;

              return aDate.seconds - bDate.seconds;
            }).reverse();
          });

        });        
      });
      
    });    
  }

  reloadData(postedProject: boolean) {
    if (postedProject) {
      this.loadData();
    }
  }

  handleError(errorMsg: string) {
    this.errorMsg = errorMsg;
    
    this.errorModalTrigger.nativeElement.click();
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

}