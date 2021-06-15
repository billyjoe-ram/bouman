import { Component, ElementRef, EventEmitter ,Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostedProject } from 'src/app/interfaces/postedProject';
import { ProfileService } from 'src/app/services/profile.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit, AfterViewInit {

  @Input('project') public project!: any;

  @Input('profileId') public profileId: string = "";

  @Input('userProfile') public userProfile: string | undefined = "";

  @Output('projectDeleted') projectDeleted: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('projectContent') public projectContent!: ElementRef;

  public button!: any;

  public profileName: any = "";  

  public profileImg: string = "";

  public fullContent: boolean = false;

  public sMDisabled: boolean = false;

  public hasLiked: boolean = false;

  public limit: number = 286;

  private profileSubs!: Subscription;

  private imageSubs!: Subscription;

  public btnDeleteProject: any;
  
  constructor(private userService: UsersService,
    private profileService: ProfileService,
    private projectsService: ProjectsService) { }

  ngOnInit(): void {
    if (this.project.content.length < this.limit) {
      this.sMDisabled = true;
    }

    if (this.project.likes.includes(this.userProfile)) {
      this.hasLiked = true;
    } else {
      this.hasLiked = false;
    }

    this.profileSubs = this.profileService.getProfile(this.profileId).subscribe((collec: any) => {
      this.profileName = collec.name;
    });

    this.imageSubs = this.userService.getProfilePicture(this.profileId).subscribe(image => {
      this.profileImg = image;
    }, (error)=>{
      this.profileImg = this.userService.profasset();
    });

    this.loadProjectText();
  }

  ngAfterViewInit(): void{
    this.gettingId();
    this.getProjectId();
  }

  showMore() {
    if (!this.sMDisabled) {
      this.limit = this.project.content.length;
    } else {
      this.limit = 286;
    }

    this.sMDisabled = !this.sMDisabled;

    this.loadProjectText();
  }

  loadProjectText() {
    // Selecting paragraph to render
    const pToRender = document.querySelector("#div-to-render");

    if (pToRender) {
      // Selecting project text
      let projectText: string = this.project.content.trim();
      
      // Slicing
      projectText = projectText.slice(0, this.limit);

      // Addind project text to paragraph
      pToRender.innerHTML = projectText;
    }    
  }

  async onLikePost(project: PostedProject) {
    this.button.disabled = true;
    try{
    await this.projectsService.likeProject(project, this.userProfile);
    this.project = await this.projectsService.getSingleProject(project);
    this.hasLiked = !this.hasLiked;
    this.button.disabled = false;
    }
    catch(err){
      console.log(err);
      this.hasLiked = !this.hasLiked;
      this.button.disabled = false;
    }
  }

  gettingId(){
    this.button = <HTMLInputElement> document.getElementById("likeButtonProject");
    this.button?.setAttribute('id', this.project.projectId);
  }

  ngOnDestroy() {
    this.profileSubs.unsubscribe();

    this.imageSubs.unsubscribe();
  }

  deleteclick(){
    document.getElementById('deleteProject')?.setAttribute('data-project', this.project.projectId);
    document.getElementById('deleteProject')?.setAttribute('data-profileId', this.project.profileId);
  }

  getProjectId(){
    const btnDelete = <HTMLInputElement> document.getElementById('btnDelete');
    if(btnDelete){
      this.btnDeleteProject = btnDelete.setAttribute('id', 'delete' + this.project.postId);
    }
  }

  async onDelete(){
    // If the user is the user, then he can delete it
    if (this.profileId === this.userProfile) {
      try{
        const delprojectid = document.getElementById('deleteProject')?.getAttribute('data-project');
        const delprofileid = document.getElementById('deleteProject')?.getAttribute('data-profileId');
        if (delprofileid != null && delprojectid != null){
        await this.projectsService.deleteProject(delprofileid, delprojectid);
        this.projectDeleted.emit(delprojectid);
      }
      } catch (error){
        console.error(error);
      } finally {
        let close = document.getElementById('close');
        close?.click();
      }
    }    
  }

}
