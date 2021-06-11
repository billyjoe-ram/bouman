import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
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
export class PublicationCardComponent implements OnInit, AfterViewInit {

  @Input('pubType') public pubType: string = "post";

  @Input('publication') public publication!: any;

  @Input('profileId') public profileId!: string;

  @Input('userProfile') public userProfile!: string | undefined;

  public postComments: any = [];

  public commentOnLoad: any = false;

  public commentsArray: any = [];

  public loadingComments: any = false;

  public isCommentsBtnClicked: any = false;

  public button!: any;

  public comment: any;

  public profileName: any = "";

  public profileImg: string = "";

  public fullContent: boolean = false;

  public sMDisabled: boolean = false;

  public limit: number = 286;

  private profileSubs!: Subscription;

  private imageSubs!: Subscription;

  constructor(private user: UsersService,
    private profile: ProfileService,
    private post: PostsService) { }

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

  ngAfterViewInit() {
    this.gettingId();
  }


  showMore() {
    this.limit = this.publication.content.length;
    this.sMDisabled = !this.sMDisabled;
  }

  async btncomments() {
    //apenas para fazer a troca do btn booleano.
    if (!this.loadingComments) {
      try {
        const idToGet = await this.post.listsAllCommentsIds(this.publication);
        idToGet.forEach((element:any) => {
          this.commentsArray = element.id;
          console.log(this.commentsArray)
        });
        this.loadingComments = false;
      } catch (error) {
        console.error(error);
        this.loadingComments = false;
      }
    }
    this.isCommentsBtnClicked = !this.isCommentsBtnClicked;
  }

  async comments(form: any) {
    //submit do form, do comentário.
    try {
      if (!this.commentOnLoad) {
        this.commentOnLoad = true;
        if (form.valid) {
          await this.post.addComment(this.userProfile, form.value.commentarea, this.publication);
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
      this.button.disabled = false;
    }
    catch (err) {
      console.error(err);
      this.button.disabled = false;
    }


  }
  gettingId() {
    this.button = <HTMLInputElement>document.getElementById("likeButtonPost");
    this.button?.setAttribute('id', this.publication.postId);
  }

  ngOnDestroy() {
    this.profileSubs.unsubscribe();

    this.imageSubs.unsubscribe();
  }

}
