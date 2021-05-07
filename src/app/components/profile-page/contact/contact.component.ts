import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'profile-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {

  @Input('editMode') public editMode: boolean = false;

  public userSocial: { email: string, linkedin: string, other: string } = { email: "", linkedin: "", other: "" };

  private profileSubs!: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private areasService: AreasService,
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  editContact(form: NgForm) {
    if (this.editMode) {
      const formValues = form.form.value;

      console.log(formValues);
    }
  }

  async loadData(){
    const profileId = this.route.snapshot.params["profid"];
    
    this.profileSubs = this.profileService.getProfile(profileId).subscribe((profile: any) => {
      // Checking if it isn't undefined
      if (profile.social.length) {
        this.userSocial = profile.social;
      } else {
        this.userSocial = { email: "E-mail não informado", linkedin: "LinkedIn não informado", other: "Nenhum outro contato informado" };
      }
            
    });
  }

  ngOnDestroy() {
    // Se existir algo na subscription, fechar
    if(this.profileSubs) {
      this.profileSubs.unsubscribe();
    }
  }
  /*
  public user: any = { name: '', desc: '', area: '', profileId: '' };

  public areas: any = {};
  
  private profileId: string = "";

  private getcoll!: Subscription;

  private getprof!: Subscription;
  */

  getData() {
    const profileId = this.route.snapshot.params["profid"];
    
    this.profileSubs = this.profileService.getProfile(profileId).subscribe((data: any) => {
      console.log(data)
    });

  }

}
