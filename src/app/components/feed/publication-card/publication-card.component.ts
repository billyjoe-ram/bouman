import { Component, EventEmitter, Input, OnInit, AfterViewInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Post } from 'src/app/interfaces/posts';
import { PostsService } from 'src/app/services/posts.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'publication-card',
  templateUrl: './publication-card.component.html',
  styleUrls: ['./publication-card.component.css']
})
export class PublicationCardComponent implements OnInit, AfterViewInit {

  @Input('pubType') public pubType: string = "post";

  @Input('publication') public publication!: any;

  @Input('profileId') public profileId!: string;

  @Input('userProfile') public userProfile!: string | undefined;

  @Output('postDeleted') postDeleted: EventEmitter<string> = new EventEmitter<string>();

  @Output('projectDeleted') projectDeleted: EventEmitter<string> = new EventEmitter<string>();

  public postComments: any = [];

  public commentsLength: any = [];

  public pubImgLoaded: any = false;

  public commentOnLoad: any = false;

  public commentsArray: any = [];

  public loadingComments: boolean = false;

  public isCommentsBtnClicked: any = false;

  public button!: any;

  public comment: string = '';

  public profileName: any = "";

  public profileImg: string = "";

  public fullContent: boolean = false;

  public sMDisabled: boolean = false;

  public nocomments: any = false;

  public btnDeletePost: any;

  public limit: number = 286;

  public hasLiked: boolean = false;

  public userImage !: Subscription;

  private profileSubs!: Subscription;

  private imageSubs!: Subscription;

  constructor(private user: UsersService,
    private profile: ProfileService,
    private post: PostsService,
    private store: AngularFirestore) { }

  ngOnInit(): void {
    this.getCommentsLength(this.publication);
    if (this.publication.content.length < this.limit) {
      this.sMDisabled = true;
    }

    if (this.publication.likes.includes(this.userProfile)) {
      this.hasLiked = true;
    } else {
      this.hasLiked = false;
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

  ngAfterViewInit() {
    this.gettingId();
    this.getPostId();
  }
  
  emitProjecDeleted(project: string) {
    this.projectDeleted.emit(project);
  }


  async onDelete() {
    // If the user is the user, then he can delete it

      const delpostid = document.getElementById('deletePost')?.getAttribute('data-post');
      const delprofileid = document.getElementById('deletePost')?.getAttribute('data-profileId');
     
      if (delprofileid == this.userProfile) {
        try {
          console.log(delpostid)
          console.log(delprofileid)
          if (delprofileid != null && delpostid != null) {
            await this.post.deletePost(delprofileid, delpostid);
            this.postDeleted.emit(delpostid);
          }
        } catch (error) {
        console.error(error);
      } finally {
        let close = document.getElementById('close');
        close?.click();
      }
    }
  }
  

  showMore() {
    this.limit = this.publication.content.length;
    this.sMDisabled = !this.sMDisabled;
  }

  getPostId() {
    const btnDelete = <HTMLInputElement>document.getElementById('btnDelete');
    if (btnDelete) {
      this.btnDeletePost = btnDelete.setAttribute('id', 'delete' + this.publication.postId);
    }
  }


  async btncomments() {
    //carrega os comentários e faz a troca do btn booleano.
    if (this.isCommentsBtnClicked == false) {
      if (this.loadingComments == false) {
        this.loadingComments = true;
        if (this.userImage) {
          this.pubImgLoaded = false;
          this.userImage.unsubscribe();
        }
        try {
          this.nocomments = false;
          this.post.listsAllCommentsIds(this.publication).then((res) => {
            const idToGet = res;

            if (idToGet.length == 0) {
              this.loadingComments = false;
              this.nocomments = true;
              console.log(this.nocomments)
            }
            else {
              this.getCommentsLength(this.publication);
              idToGet.forEach((element: any, index: any) => {

                this.post.getEachComment(element.id, this.publication);

                this.post.getEachComment(element.id, this.publication).then((res: any) => {

                  this.commentsArray[index] = res.data();

                  this.profile.getProfilePromise(this.commentsArray[index].profileId).then((res: any) => {

                    const tempData: any = res.data();

                    this.commentsArray[index].userName = tempData.name;

                    this.userImage = this.user.getProfilePicture(this.commentsArray[index].profileId).subscribe((res: any) => {

                      this.commentsArray[index].userImg = res;

                      console.log(this.loadingComments)
                      this.pubImgLoaded = true;

                    });
                  }).catch((err) => {
                    console.error(err)
                    this.loadingComments = false;
                  }).finally(() => {
                    this.loadingComments = false;
                  });
                }).catch((err) => {
                  console.error(err);
                  this.loadingComments = false;
                });
              });
            }
          }).catch((err) => {
            console.error(err)
            this.loadingComments = false;
          });
        } catch (error) {
          console.error(error);
        }
        this.isCommentsBtnClicked = !this.isCommentsBtnClicked;
      }
    }
    else {
      this.isCommentsBtnClicked = false;
    }
  }

  deleteclick(){
  document.getElementById('deleteProject')?.setAttribute('data-project', this.publication.postId);
  document.getElementById('deleteProject')?.setAttribute('data-profileId', this.publication.profileId);
}

  async getCommentsLength(post: Post) {
    this.commentsLength = await this.post.listsAllCommentsIds(post);
  }

  async comments(form: any) {
    //submit do form, do comentário.
    try {
      if (!this.commentOnLoad) {
        this.commentOnLoad = true;
        if (form.valid && this.comment.length <= this.limit && this.comment.trim().length) {
          await this.post.addComment(this.userProfile, this.comment, this.publication);
        }
        else {
          //catch de algum erro.
        }
        this.commentOnLoad = false;
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  async onLikePost(post: Post) {
    this.button.disabled = true;
    try {
      await this.post.likePost(post, this.userProfile);
      this.publication = await this.post.getSinglePost(post);
      this.hasLiked = !this.hasLiked;  
      this.button.disabled = false;
    }
    catch (err) {
      console.error(err);
      this.hasLiked = !this.hasLiked;
      this.button.disabled = false;
    }
  }

  /*
   async onLikePost(post: Post) {
const oldLikesQtd = this.publication.likes.length;
const button = <HTMLInputElement>document.getElementById("likeButtonPost");
// button.disabled = true;
try {
  await this.post.likePost(post, this.userProfile);
  this.publication = await this.post.getSinglePost(post);
  this.hasLiked = !this.hasLiked;
  button.disabled = false;
} catch (err) {
  console.error(err);
  this.hasLiked = !this.hasLiked;
  button.disabled = false;
}
}
  */


  gettingId() {
    this.button = <HTMLInputElement>document.getElementById("likeButtonPost");
    this.button?.setAttribute('id', this.publication.postId);
  }

  ngOnDestroy() {
    this.profileSubs.unsubscribe();

    this.imageSubs.unsubscribe();
  }

}
