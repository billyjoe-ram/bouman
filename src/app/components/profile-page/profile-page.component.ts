import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/interfaces/posts';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  public userPosts: any[] = [];

  public userProjects: any[] = [];

  public profileId: string = "";

  public userId: string | undefined = "";
  public userData: any = {};

  public sameUser: boolean = false;

  private paramsSubs!: Subscription;

  private postsSubs!: Subscription;

  private userSubs!: Subscription;
  
  private profileSubs!: Subscription;
  
  constructor(
    private posts: PostsService,
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private usersServices: UsersService,
    private profileService: ProfileService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.usersServices.getUid().then(id => {
      this.userId = id;
    })

    this.loadData();
  }

  async loadData() {
    const user = await this.authService.getAuth().currentUser;

    this.paramsSubs = this.route.params.subscribe((params) => {
      this.profileId = params['profid'];

      this.posts.listProfilePosts(this.profileId).then((posts) => {
        posts.forEach(post => {
          this.userPosts.push(post.data());
        });
      });

      this.projectsService.listProfileProjects(this.profileId).then(projects => {
        projects.forEach(project => {
          this.userProjects.push(project.data());
        });
      });

      this.profileSubs = this.usersServices.getProfile(user?.uid).subscribe((data : any) => {

        if (this.profileId == data.profileId) {
          this.sameUser = true;
        } else {
          this.sameUser = false;
        }
        
      });

      this.profileSubs = this.profileService.getProfile(this.profileId).subscribe((profile: any) => {
        this.userData = profile;
      });

    });

  }

  ngOnDestroy() {
    if (this.paramsSubs) {
      this.paramsSubs.unsubscribe();
    }

    if (this.postsSubs) {
      this.postsSubs.unsubscribe();
    }

    if (this.userSubs) {
      this.userSubs.unsubscribe();
    }

    if (this.profileSubs) {
      this.profileSubs.unsubscribe();
    }

  }

}
