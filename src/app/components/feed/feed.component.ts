import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  public content: any;

  constructor(private posts: PostsService) { }

  ngOnInit(): void {
  }

addproj(){
  console.log(this.content);
  // try{
  //   this.posts.addProject(this.content)
  // }catch(err){
  //   window.alert(err);
  // }
}

}