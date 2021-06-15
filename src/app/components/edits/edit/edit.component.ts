import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Edict } from 'src/app/interfaces/edict';

import { EdictsService } from 'src/app/services/edicts.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  @ViewChild('edictForm') edictForm!: NgForm;

  public edict: any = {
    edictId: "",
    companyId: "",
    title: "",
    content: "",
    createdAt: new Date(),
    profilesApplied: []
  };

  public newEdict: boolean = false;
  
  public isOwner: boolean = false;

  public edictMembers: string[] = [];

  public edictMembersData: { profileId: string, name: string, profilePicture: string }[] = [];

  private edictCompany: string = "";
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private edictServ: EdictsService,
    private usersService: UsersService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    const docId = this.route.snapshot.params['id'];

    this.loadCompany();

    if (docId === 'new') {
      this.newEdict = true;
    } else {
      this.newEdict = false;
    }

    this.loadCompany().then(() => {      
      this.loadEdict();
    });
  }

  onSubmit() {
    const date = new Date();

    const formValue = this.edictForm.form.value;

    if (formValue.title.trim() && formValue.content.trim()) {
      
      if (this.newEdict) {
        this.edictServ.addEdict({ 
          companyId: this.edictCompany,
          title: formValue.title,
          content: formValue.content,
          createdAt: date,
          profilesApplied: []
        }).finally(() => { this.router.navigate(["/edicts/overview"]) });
      }
    } else {
      alert("Preencha corretamente o edital");
    }

  }

  loadEdict() {
    const docId: string = this.route.snapshot.params['id'];    

    // Preventing loading in new projects
    if (!this.newEdict) {
      this.edictServ.listEdict(this.edictCompany, docId).then((edict: any) => {
        this.edict = edict.data();

        this.edictMembers = this.edict.profilesApplied;

        this.edictForm.setValue({ title: this.edict.title, content: this.edict.content });

        this.loadEdictMembers();
      });                
    }
        
  }

  onDelete() {
    this.edictServ.deleteEdict(this.edict).finally(() => { this.router.navigate(["/edicts/overview"]) });
  }

  private loadEdictMembers() {
    // For each profile / index    
    this.edictMembers.forEach((profile, index) => {
      this.edictMembersData[index] = { profileId: "", name: "", profilePicture: "" };

      this.profileService.getProfilePromise(profile).then((profileResult: any) => {
        this.edictMembersData[index].profileId = profileResult.id;
        this.edictMembersData[index].name = profileResult.data().name;

        // Splicing long names
        this.edictMembersData[index].name = this.edictMembersData[index].name.split(" ").splice(0, 3).join(" ");
      });      

      this.usersService.getSearchPic(profile).then(pic => {
        this.edictMembersData[index].profilePicture = pic;
      }).catch(() => {
        this.edictMembersData[index].profilePicture = this.usersService.profasset();
      });

    });
  }

  private async loadCompany() {
    const companyUid = await this.usersService.getUid();

    const companyData = await this.usersService.getCompany(companyUid);

    const companyProfile = (companyData.data() as any).profileId;

    this.edictCompany = companyProfile;
  }

}
