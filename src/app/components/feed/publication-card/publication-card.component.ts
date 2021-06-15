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

  @Output('postDeleted') postDeleted: EventEmitter<string> = new EventEmitter<string>();

  @Output('projectDeleted') projectDeleted: EventEmitter<string> = new EventEmitter<string>();

  public profileName: any = "";  

  public profileImg: string = "";

  public fullContent: boolean = false;

  public sMDisabled: boolean = false;

  public limit: number = 286;

  public btnDeletePost: any;

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

  ngAfterViewInit(){
    this.getPostId();
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
      console.error(err);
      button.disabled = false;
    }

  }

  emitProjecDeleted(project: string) {
    this.projectDeleted.emit(project);
  }

  ngOnDestroy() {
    this.profileSubs.unsubscribe();

    this.imageSubs.unsubscribe();
  }

  deleteclick(post:any){
    document.getElementById('deletePost')?.setAttribute('data-post', this.publication.postId);
    document.getElementById('deletePost')?.setAttribute('data-profileId', this.publication.profileId);
  }

  getPostId(){
    const btnDelete = <HTMLInputElement> document.getElementById('btnDelete');
    if(btnDelete){
      this.btnDeletePost = btnDelete.setAttribute('id', 'delete' + this.publication.postId);
    }
  }

  async onDelete() {
    // If the user is the user, then he can delete it

    console.log('oi');
      const delpostid = document.getElementById('deletePost')?.getAttribute('data-post');
      const delprofileid = document.getElementById('deletePost')?.getAttribute('data-profileId');
      if ( delprofileid == this.profileId){
        console.log('Tudo bem com todos?')
      }
      try{
        console.log(delpostid);
        console.log(delprofileid);
        if (delprofileid != null && delpostid != null){
        await this.post.deletePost(delprofileid, delpostid);
        this.postDeleted.emit(delpostid);
      }
      } catch (error){
        console.error(error);
      } finally {
        let close = document.getElementById('close');
        close?.click();
      }
    }    
  

}
