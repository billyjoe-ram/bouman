import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EdictsService } from 'src/app/services/edicts.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  @ViewChild('edictForm') edictForm!: NgForm;

  public edict: { title: string, content: string } = { title: "", content: "" };

  public newEdict: boolean = false;
  
  public isOwner: boolean = false;

  private edictCompany: string = "";
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private edictServ: EdictsService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    const docId = this.route.snapshot.params['id'];

    this.loadCompany();

    if (docId === 'new') {
      this.newEdict = true;
    } else {
      this.newEdict = false;
    }
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

      } else {
        alert("Edital não alterável");
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

    const companyData = await this.usersService.getCompany(companyUid);

    const companyProfile = (companyData.data() as any).profileId;

    this.edictCompany = companyProfile;
  }

}
