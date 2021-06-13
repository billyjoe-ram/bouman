import { Component, EventEmitter, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostsService } from 'src/app/services/posts.service';
import { NgForm } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

@Injectable({
  providedIn: 'root',
})

export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('form') form!: NgForm;
  
  @Output('isCompany') isCompanyEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  public profileImg: any = "";
  public profileId: string = "";

  public search: string = "";
  public profileResults : any[] = [];

  public isCompany!: boolean;
  
  private profile!: Subscription;
  private userSubs!: Subscription;

  collapsed = true;

  constructor(private authService: AuthService, private user: UsersService, private postsService: PostsService, private searchService: SearchService, private router: Router) { }

  ngOnInit(): void {
    this.getData();
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
      this.profileResults = data;  
      
      this.profileResults.forEach((profile, index) => {
        this.user.getSearchPic(profile.id).then(pic => {
          this.profileResults[index].picture = pic;
        }).catch(error => {
          this.profileResults[index].picture = this.user.profasset();
        });
      });
      if (data.length == 0) this.profileResults = []; 
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

    this.checkColl(user?.uid)

    this.userSubs = (await this.user.getProfile(user?.uid)).subscribe((profile: any) => {
      this.profileId = profile.profileId;

      this.profile = this.user.getProfilePicture(this.profileId).subscribe((url: any) => {
        this.profileImg = url;
      }, (err: any) => {
        this.profileImg = this.user.profasset();
      });
    });

  }

  checkColl(userUid: string | undefined) {
    this.user.checkusercompany(userUid).then(async res => {
      if (res == 'Users') {
        this.isCompany = false;        
      } else if (res == 'Companies') {
        this.isCompany = true;
      }
      
      this.isCompanyEvent.emit(this.isCompany);
    })
  }

  onSendSearch(event: KeyboardEvent) {
    const inputText: string = this.form.value.searchParam.trim();

    if (event.key === "Enter" && inputText.length) {

      const searchParam = inputText.toLowerCase().split(" ").join("+");

      this.searchService.attrSearch(searchParam);

      this.router.navigate(["/results"], { queryParams: { search: searchParam } });

      this.searching();

      this.searchService.profileResults = this.profileResults;

      // console.log(this.searchService.profileResults);
      
      this.searchService.searchProjects();
    }
  }

}
