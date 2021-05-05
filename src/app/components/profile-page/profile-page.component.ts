import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/interfaces/posts';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  public userPosts: any[] = [];
  public editbutton : boolean = true;

  private paramsSubs!: Subscription;
  private postsSubs!: Subscription;  

  private profileId: string = "";
  
  constructor(private posts: PostsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadData();
    console.log(this.editbutton);
  }

  loadData() {
    this.paramsSubs = this.route.params.subscribe((params) => {
      this.profileId = params['profid'];

      this.postsSubs = this.posts.listProfilePosts(this.profileId).subscribe(posts => {
        this.userPosts = posts;
      });
    });

  }

  ngOnDestroy() {
    this.paramsSubs.unsubscribe();

    this.postsSubs.unsubscribe();
  }

}
