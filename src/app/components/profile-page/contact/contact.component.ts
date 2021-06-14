import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class ContactComponent implements OnInit, OnChanges ,OnDestroy {

  @Input('editMode') public editMode: boolean = false;
  @Input('profileId') public profileId: string = "";

  @ViewChild("dismissButton") private dismissModalBtn!: ElementRef;

  public userSocial: { email: string, linkedin: string, other: string } = { email: "", linkedin: "", other: "" };

  public hasSocial: boolean = false;  

  private profileSubs!: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private areasService: AreasService,
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void { }

  ngOnChanges() {
    this.loadData();
  }

  async editContact(form: NgForm) {
    if (this.editMode) {
      const formValues = form.form.value;

      const dismissBtn = this.dismissModalBtn.nativeElement;

      this.userSocial = formValues;

      try {
        await this.profileService.updateContact(this.profileId, this.userSocial);
      } catch(error) {
        console.error(error);
      } finally {
        dismissBtn.click();
      }

    }
  }

  loadData() {
    // Checking if the value came through propertiy binding
    if(this.profileId) {
      this.profileSubs = this.profileService.getProfile(this.profileId).subscribe((profile: any) => {
      
        // Checking if it isn't undefined      
        if (profile.social) {
          this.hasSocial = true;
          this.userSocial = profile.social;
          // Checking if isn't empty string
          if(!profile.social.email){
            profile.social.email = "E-mail não informado"
          }
          if(!profile.social.linkedin){
            profile.social.linkedin = "LinkedIn não informado"
          }
          if(!profile.social.other){
            profile.social.other = "Nenhum outro contato informado"
          }
        } else {
          this.hasSocial = false;
          this.userSocial = { email: "E-mail não informado", linkedin: "LinkedIn não informado", other: "Nenhum outro contato informado" };
        }
  
      });
    }
    
  }

  ngOnDestroy() {
    // Se existir algo na subscription, fechar
    if(this.profileSubs) {
      this.profileSubs.unsubscribe();
    }
  }

}
