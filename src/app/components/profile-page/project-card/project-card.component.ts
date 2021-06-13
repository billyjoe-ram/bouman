import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
export class ProjectCardComponent implements OnInit {

  @Input('project') public project!: any;

  @Input('profileId') public profileId: string = "";

  @Input('userProfile') public userProfile: string | undefined = "";

  @ViewChild('projectContent') public projectContent!: ElementRef;

  public profileName: any = "";  

  public profileImg: string = "";

  public fullContent: boolean = false;

  public sMDisabled: boolean = false;

  public limit: number = 286;

  private profileSubs!: Subscription;

  private imageSubs!: Subscription;
  
  constructor(private userService: UsersService,
    private profileService: ProfileService,
    private projectsService: ProjectsService) { }

  ngOnInit(): void {
    if (this.project.content.length < this.limit) {
      this.sMDisabled = true;
    }

    this.profileSubs = this.profileService.getProfile(this.profileId).subscribe((collec: any) => {
      this.profileName = collec.name;
    });

    this.imageSubs = this.userService.getProfilePicture(this.profileId).subscribe(image => {
      this.profileImg = image;
    }, (error)=>{
      this.profileImg = this.userService.profasset();
    });

    this.loadProjectText()
  }

  showMore() {
    this.limit = this.project.content.length;
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
    const button = <HTMLInputElement> document.getElementById("likeButtonProject");
    button.disabled = true;
    await this.projectsService.likeProject(project, this.userProfile);
    this.project = await this.projectsService.getSingleProject(project);
    button.disabled = false;
  }

  ngOnDestroy() {
    this.profileSubs.unsubscribe();

    this.imageSubs.unsubscribe();
  }

  onDelete(){
    
  }

}
