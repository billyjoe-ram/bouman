import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

@Injectable({
  providedIn: 'root',
})

export class HeaderComponent implements OnInit, OnDestroy {

  public profileImg: any = "";
  public profileId: string = "";
  public search: string = "";
  private profile!: Subscription;
  private userSubs!: Subscription;
  public searchresult : any[] = [];

  @Output() featureSelected = new EventEmitter<string>();

  collapsed = true;

  constructor(private authService: AuthService, private user: UsersService, private postsService: PostsService) { }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy() {
    this.profile.unsubscribe();

    this.userSubs.unsubscribe();
  }

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }
  
  togglesearch(){
    if (this.search == ""){
      document.getElementById('search')?.classList.toggle("show");
    }
  }

  searching() {
// const filterItems = (elemento:String, data:string[]) => {
//   return data.filter(el => el.toLowerCase().indexOf(elemento.toLowerCase()) > -1);};

    this.postsService.searchingprofiles(this.search).then(data=>{

//       const teste = data;
//       console.log(filterItems(this.search, teste));
//       this.searchresult = data;
//       console.log(data);
      this.searchresult = data;
    });

  }

  togglesearchclick(){
    this.search = "";
    document.getElementById('search')?.classList.toggle("show");
  }

  logOut() {
    this.authService.logout();
  }

  async getData() {
    const user = await this.authService.getAuth().currentUser;

    this.userSubs = this.user.getProfile(user?.uid).subscribe((profile: any) => {
      this.profileId = profile.profileId;

      this.profile = this.user.getProfilePicture(this.profileId).subscribe((url: any) => {
        this.profileImg = url;
      }, (err: any) => {
        this.profileImg = this.user.profasset();
      });
    });

  }

}
