import { Component, ElementRef, EventEmitter, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectContent } from 'src/app/interfaces/projectContent';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { SearchService } from 'src/app/services/search.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit, OnDestroy {

  @ViewChild('tabList') tabList!: ElementRef;
  
  public param: string = "";

  public allResults: any[] = [];
  public profilesResults: any[] = [];
  public projectsResults: any[] = [];

  public limit: number = 286;

  public profileId: string = "";

  public selectedSect: string = "Projetos";

  public routeSubs!: Subscription;

  @Output() public pageLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private authService: AuthService,
    private usersService: UsersService,
    private postsService: PostsService
  ) { }

  ngOnInit(): void {
    this.routeSubs = this.route.queryParams.subscribe((qParams) => {
      const queryParams = qParams["search"];

      this.searchService.attrSearch(queryParams);
      
      this.loadProfile().then(() => {
        this.addEvents();

        this.postsService.searchingProfiles(queryParams).then((data) => {
          this.profilesResults = data;
        });
        
        this.searchService.searchProjects().then(() => {
          this.projectsResults = this.searchService.searchResult;
        });
      });
    });
  }

  loadProjectText(result: ProjectContent) {
    if (result) {
      // Selecting paragraph to render
      const pToRender = document.querySelector("#div-to-render");

      if (pToRender) {
        // Selecting project text
        let projectText: string = result.content.trim();

        // Slicing
        projectText = projectText.slice(0, this.limit);

        // Addind project text to paragraph
        pToRender.innerHTML = projectText;
      }
    }
    
  }  

  private async loadProfile() {
    // Awaiting current user id for profile id    
    const user = await this.authService.getAuth().currentUser;

    // Subscribing to current user to get the profileId
    this.usersService.getCollection(user?.uid).then((user: any) => {
      // Passing to attribute
      this.profileId = user.data().profileId;
    }).catch(async () => {
      const companyData = await this.usersService.getCompany(user?.uid);
      
      this.profileId = (companyData.data() as any).profileId;
    });
  }

  private addEvents() {
    // Checking if the element was created
    if (this.tabList) {
      // Getting the element itself
      const list = this.tabList.nativeElement;

      // Getting its children
      const listItems = list.children;

      // For each .form-check, handle 
      for (let listItem of listItems) {
        // Add a callback attached to click
        listItem.addEventListener("click", (event: any) => {
          // Event target
          let input = event.target;

          // Input label
          const itemText = input.innerHTML;

          this.selectedSect = itemText;
        });
      }

    }
  }

  ngOnDestroy() {
    if (this.routeSubs) {
      this.routeSubs.unsubscribe();
    }
  }

}
