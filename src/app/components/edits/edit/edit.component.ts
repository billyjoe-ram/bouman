import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { DocsService } from 'src/app/services/docs.service';
import { EdictsService } from 'src/app/services/edicts.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  @ViewChild('edictForm') edictForm!: NgForm;
  
  public textareaText: string = "Textarea text";

  public edict: { title: string, content: string } = { title: "", content: "" };

  public newEdict: boolean = false;
  
  public isOwner: boolean = false;

  private edictCompany: string = "";
  
  constructor(
    private route: ActivatedRoute,
    private edictServ: EdictsService,
    private usersService: UsersService) { }

  ngOnInit(): void {
    const docId = this.route.snapshot.params['id'];

    this.loadCompany();

    if (docId === 'new') {
      this.newEdict = true;
    } else {
      this.newEdict = false;
    }
  }

  onSubmit(form?: NgForm) {
    if(form) {
      console.log(form);
    }
    console.log(this.edictForm);
  }

  loadEdict() {
    const docId: string = this.route.snapshot.params['id'];

    // Preventing loading in new projects
    if (!this.newEdict) {
      this.edictServ.listEdict(this.edictCompany, docId).then((edict: any) => {
        this.edict = edict.data();

        this.edictForm.setValue(this.edict);
      });
      console.log("not a new project");
      console.log(this.edictCompany);
    }
        
  }

  onDelete() {
    console.log("Bruh I can't delete this right now");
  }

  private async loadCompany() {
    const companyUid = await this.usersService.getUid();

    const companyData = await this.usersService.getCollection(companyUid);

    const companyProfile = (companyData.data() as any).profileId;

    this.edictCompany = companyProfile;
  }

}
