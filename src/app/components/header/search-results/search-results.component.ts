import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  
  public param: string = "";
  
  constructor(private route: ActivatedRoute, private searchService: SearchService) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.queryParams["search"];

    this.searchService.searchByParam();
  }

}
