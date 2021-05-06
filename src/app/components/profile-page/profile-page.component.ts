import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/interfaces/posts';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  public userPosts: any[] = [];
  public profileId: string = "";

  public sameUser: boolean = false;

  private paramsSubs!: Subscription;
  private postsSubs!: Subscription;
  private profileSubs!: Subscription;
  
  constructor(
    private posts: PostsService,
    private route: ActivatedRoute,
    private usersServices: UsersService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.loadData();
    console.log(this.editbutton);
  }

  async loadData() {
    const user = await this.auth.getAuth().currentUser;

    this.paramsSubs = this.route.params.subscribe((params) => {
      this.profileId = params['profid'];

      this.postsSubs = this.posts.listProfilePosts(this.profileId).subscribe(posts => {
        this.userPosts = posts;
      });

      this.profileSubs = this.usersServices.getProfile(user?.uid).subscribe((data : any)=>{
        
        if (this.profileId == data.profileId) {
          this.sameUser = true;
        } else {
          this.sameUser = false;
        }
        
      });

    });

  }

  ngOnDestroy() {
    this.paramsSubs.unsubscribe();

    this.postsSubs.unsubscribe();

    this.profileSubs.unsubscribe();
  }

}
