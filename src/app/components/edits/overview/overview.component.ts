import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { EdictsService } from 'src/app/services/edicts.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnDestroy {

  @ViewChild('edictsList') private pBody!: ElementRef;

  public edicts: any[] = [];
  public loaded: any = false;

  private edictsSubs!: Subscription;

  constructor(private edictsService: EdictsService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.loadEdicts();
  }

  private async loadEdicts() {

    this.loaded = false;

    const profileUid = await this.usersService.getUid();

    const companyProfile = await this.usersService.getCompany(profileUid);

    const profileId = (companyProfile.data() as any).profileId;

    this.edictsSubs = this.edictsService.listCompanyEdicts(profileId).subscribe(data => {
      this.loaded = false;
      data.forEach((query) => {
        this.edicts.push(query);
      });

      // Ordering by date
      this.edicts.sort((a: any, b: any) => {
        return a.createdAt.seconds - b.createdAt.seconds;
      }).reverse();
      this.loaded = true;
    })
  }

  ngOnDestroy() {
    if (this.edictsSubs) {
      this.edictsSubs.unsubscribe();
    }
  }

}
