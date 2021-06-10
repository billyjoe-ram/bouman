import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/interfaces/posts';
import { PostsService } from 'src/app/services/posts.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'publication-card',
  templateUrl: './publication-card.component.html',
  styleUrls: ['./publication-card.component.css']
})
export class PublicationCardComponent implements OnInit {

  @Input('pubType') public pubType: string = "post";
  
  @Input('publication') public publication!: any;

  @Input('profileId') public profileId!: string;

  @Input('userProfile') public userProfile!: string | undefined;

  @Output('postDeleted') postDeleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  public profileName: any = "";  

  public profileImg: string = "";

  public fullContent: boolean = false;

  public sMDisabled: boolean = false;

  public limit: number = 286;

  private profileSubs!: Subscription;

  private imageSubs!: Subscription;
  
  constructor(private user: UsersService,
    private profile: ProfileService,
    private post: PostsService, 
    private store: AngularFirestore) { }

  ngOnInit(): void {
    if (this.publication.content.length < this.limit) {
      this.sMDisabled = true;
    }

    this.profileSubs = this.profile.getProfile(this.profileId).subscribe((collec: any) => {
      this.profileName = collec.name;
    });

    this.imageSubs = this.user.getProfilePicture(this.profileId).subscribe(image => {
      this.profileImg = image;
    }, (error) => {
      this.profileImg = this.user.profasset();
    });
  }

  showMore() {
    this.limit = this.publication.content.length;
    this.sMDisabled = !this.sMDisabled;
  }

  async onLikePost(post: Post) {
    const button = <HTMLInputElement> document.getElementById("likeButtonPost");
    button.disabled = true;
    try{
    await this.post.likePost(post, this.userProfile);
    this.publication = await this.post.getSinglePost(post);
    button.disabled = false;  
    }
    catch(err){
      console.log(err);
      button.disabled = false;
    }

  }

  ngOnDestroy() {
    this.profileSubs.unsubscribe();

    this.imageSubs.unsubscribe();
  }

  async onDelete(){
    try{
      await this.post.deletePost(this.profileId, this.publication.postId);
      this.postDeleted.emit(true);
    } catch (error){
      console.log(error);
    } finally {
      let close = document.getElementById('close');
      close?.click();
    }
  }

}
