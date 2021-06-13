import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectContent } from 'src/app/interfaces/projectContent';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService } from 'src/app/services/search.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  public param: string = "";

  public profileResults: any[] = [];
  public results: any[] = [];

  public limit: number = 286;

  public profileId: string = "";

  @Output() public pageLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.queryParams["search"];

    this.loadProfile().then(() => {
      this.searchService.searchProjects().then(() => {
        this.results = this.searchService.searchResult;
      });

      this.profileResults = this.searchService.profileResults;
    });
  }

  loadProjectText(result: ProjectContent) {
    if (result) {
      // Selecting paragraph to render
      const pToRender = document.querySelector("#div-to-render");

      if (pToRender) {
        console.log(result);
        // Selecting project text
        let projectText: string = result.content.trim();

        // Slicing
        projectText = projectText.slice(0, this.limit);

        // Addind project text to paragraph
        pToRender.innerHTML = projectText;
        console.log(projectText);
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

}
