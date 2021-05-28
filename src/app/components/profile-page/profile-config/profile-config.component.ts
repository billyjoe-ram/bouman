import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AreasService } from 'src/app/services/areas.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms'
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-config',
  templateUrl: './profile-config.component.html',
  styleUrls: ['./profile-config.component.css']
})
export class ProfileConfigComponent implements OnInit, OnDestroy {
  
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('profConfForm') form!: NgForm;

  public user: any = { name: '', desc: '', area: '', subarea: '', profileId: '' };

  public areas: any[] = [];

  public subareas: any[] = [];
  
  private profileId: string = "";

  private getcoll!: Subscription;

  private getprof!: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private areasService: AreasService,
    private service: ProfileService,
    private auth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  async onSubmit(form: NgForm) {
    const user = await this.authService.getAuth().currentUser;
    let submit = document.getElementById('submit')
    const formData = form.value;
    try {
      this.profileId = this.user.profileId;

      this.service.updateProfile(user?.uid, this.user.profileId, { name: formData.name, description: formData.desc, area: formData.area, subarea: formData.subarea });

      this.router.navigate(["/profiles/", this.profileId]);
    } catch (err) {
      console.error(err);
    } finally {
      submit?.click();
    }

  }
  
  async getData() {
    const user = await this.authService.getAuth().currentUser;

    this.getcoll = (await this.userService.getProfile(user?.uid)).subscribe((data:any) => {
      this.user.area = data.area;
      this.user.subarea = data.subarea;      
      this.user.profileId = data.profileId;
      
      this.getAreas();
      this.getSubareas();

      this.getprof = this.service.getProfile(this.user.profileId).subscribe((data : any) => {
        this.user.name = data.name;
        this.user.desc = data.desc;
      });

    });
  }

  ngOnDestroy(){
    if (this.getcoll) {
      this.getcoll.unsubscribe();
    }

    if (this.getprof) {
      this.getprof.unsubscribe();
    }

  }

  getAreas(){
    this.areasService.getAreas().then((areas) => {
      this.areas = areas;
    });
  }

  getSubareas() {
    this.subareas = [];
    const areaId = this.user.area;

    if (areaId) {
      this.areasService.getSubarea(areaId).then((subareas) => {
        this.subareas = subareas;
      });
    }

  }

}
