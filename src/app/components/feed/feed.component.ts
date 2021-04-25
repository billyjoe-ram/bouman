import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {

  public content: any;

  private profileId!: string | undefined;

  private userSubs!: Subscription;

  constructor(private auth: AuthService,
    private posts: PostsService,
    private user: UsersService) { }

  ngOnInit(): void {
    this.loadData();
  }

  createPost(form: NgForm) {
    try{
      const post = this.posts.addPost(this.profileId, this.content);
    } catch(err){
      console.error(err);
    } finally {
      form.reset();
    }
  }

  async loadData() {
    // Awaiting current user id for profile id
    const user = await this.auth.getAuth().currentUser;

    this.userSubs = this.user.getProfile(user?.uid).subscribe((profile: any) => {
      this.profileId = profile.profileId;
    });
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe()
  }

}