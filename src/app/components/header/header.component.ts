import { Component, EventEmitter, OnInit, OnDestroy, Output, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Injectable } from '@angular/core';
import { from, Subscription } from 'rxjs';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

@Injectable({
  providedIn: 'root',
})

export class HeaderComponent implements OnInit, OnChanges, OnDestroy {

  public profileImg: any = "";
  public profileId: string = "";
  public search: string = "";
  public searchResult : any[] = [];

  private isCompany: boolean = false;
  
  private profile!: Subscription;
  private userSubs!: Subscription;

  @Output() featureSelected = new EventEmitter<string>();

  collapsed = true;

  constructor(private authService: AuthService, private user: UsersService, private postsService: PostsService) { }

  ngOnInit(): void {
    this.getData();
  }

  ngOnChanges() {
    this.checkColl();
  }

  ngOnDestroy() {
    if (this.profile) {
      this.profile.unsubscribe();
    }
    
    if(this.userSubs) {
      this.userSubs.unsubscribe();
    }    
  }  
  
  togglesearch(){
    if (this.search == ""){
      document.getElementById('search')?.classList.toggle("show");
    }
  }

  searching() {
    this.postsService.searchingProfiles(this.search).then(data => {
      // Attr all profiles found to the search resulsts
      this.searchResult = data;  
      
      this.searchResult.forEach((profile, index) => {
        this.user.getSearchPic(profile.id).then(pic => {
          this.searchResult[index].picture = pic;
        }).catch(error => {
          this.searchResult[index].picture = this.user.profasset();
        });
      });
      if (data.length == 0) this.searchResult = []; 
    });
  }

  toggleSearchClick(){
    this.search = "";
    document.getElementById('search')?.classList.toggle("show");
  }

  logOut() {
    this.authService.logout();
  }

  async getData() {
    const user = await this.authService.getAuth().currentUser;

    this.userSubs = (await this.user.getProfile(user?.uid)).subscribe((profile: any) => {
      this.profileId = profile.profileId;

      this.profile = this.user.getProfilePicture(this.profileId).subscribe((url: any) => {
        this.profileImg = url;
      }, (err: any) => {
        this.profileImg = this.user.profasset();
      });
    });

  }

  checkColl() {
    this.authService.getAuth().currentUser.then((user: any) => {
      console.log(user.uid)
      this.user.checkusercompany(user.uid).then(async res => {
        if (res == 'Users') {
          this.isCompany = false;
        }
        if (res == 'Companies') {
          this.isCompany = true;
        }
      })
    });
  }

}
