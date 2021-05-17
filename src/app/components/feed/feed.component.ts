import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/interfaces/posts';
import { Project } from 'src/app/interfaces/project';
import { ProjectContent } from 'src/app/interfaces/projectContent';
import { AuthService } from 'src/app/services/auth.service';
import { DocsService } from 'src/app/services/docs.service';
import { PostsService } from 'src/app/services/posts.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy {

  @ViewChild('errorModalTrigger') errorModalTrigger!: ElementRef;
  
  @ViewChild('projectsModalTrigger') projectsModalTrigger!: ElementRef;

  @ViewChild('selectedProjectContent') selectedProjectContent!: ElementRef;

  @ViewChild('checkBoxes') checkBoxes!: ElementRef;
  
  public content: string = "";

  public profilesFollowing: string[] = [];

  public profileId!: string | undefined;

  public feedPosts: { profileId: string, posts: Post[] }[] = [];

  public userProjects: Project[] = [];

  public selectedProject!: any;

  public selectedProjectText: string[] = [];

  public errorMsg: string = "";
  
  private userSubs!: Subscription;

  private profileSubs!: Subscription;

  private postsSubs!: Subscription;

  private docSubs!: Subscription;

  constructor(
    private auth: AuthService,
    private posts: PostsService,
    private user: UsersService,
    private profile: ProfileService,
    private docs: DocsService) { }

  ngOnInit(): void {
    this.loadData();
  }

  createPost(form: NgForm) {

    if (this.content.trim()) {
      try {
        const post = this.posts.addPost(this.profileId, this.content);
      } catch (err) {
        console.error(err);
      } finally {
        form.reset();
      }
    } else {
      this.handleError("Não há nada na sua postagem");
    }
    
  }

  async loadData() {
    // Awaiting current user id for profile id
    const user = await this.auth.getAuth().currentUser;

    // Subscribing to current user to get the profileId
    this.userSubs = this.user.getProfile(user?.uid).subscribe((user: any) => {

      // Passing to attribute
      this.profileId = user.profileId;

      // Executing the service method to get profile data
      this.profileSubs = this.profile.getProfile(this.profileId).subscribe((profile: any) => {

        // Passing following profiles to array
        if (profile.following.length > 0) {
          this.profilesFollowing = profile.following;
        }

        // In pratical terms, you "follow yourself", but not in the database, only in the attribute
        if (!this.profilesFollowing.includes(this.profileId as string)) {
          this.profilesFollowing.push(this.profileId as string);
        }
      
        // Interating over each profile followed
        this.profilesFollowing.forEach(profile => {
          // Passing to posts attribute this profile id and an empty array
          this.feedPosts.push({ profileId: profile, posts: [] });

          let profileIndex = this.profilesFollowing.indexOf(profile);
          
          // For this profile (brought by iteration), bring its posts and add in the object array
          this.postsSubs = this.posts.listProfilePosts(profile).subscribe((profilePost: any) => {
            // Pushing each post object feed conten array
            this.feedPosts[profileIndex].posts = profilePost;

            // Ordering by date
            this.feedPosts[profileIndex].posts.sort((a: any, b: any) => {
              return a.publishedAt.seconds - b.publishedAt.seconds;
            }).reverse();                        
          });

          // Removing duplicates by postId
          // this.feedPosts = this.feedPosts.filter(element => {
          //   return element.postId != element.postId;
          // });

        });
      });
      
    });    
  }

  importProject() {
    // Reset the array
    this.userProjects = [];

    this.docs.listProjects().then((projects) => {
      // Retrieving user projects
      projects.forEach((project) => {
        // Add to the array
        this.userProjects.push(project.data());
      });

      // Ordering by date
      this.userProjects.sort((a: any, b: any) => {
        return a.lastEdit.seconds - b.lastEdit.seconds;
      }).reverse();
    });    

    // Triggering modal
    this.projectsModalTrigger.nativeElement.click();
  }

  selectProject(project: Project) {
    this.selectedProject = project;
  }

  showProject() {
    this.addEvents();

    // Ordering keys that were messed
    const orderedKeys = Object.keys(this.selectedProject.content).sort();
    
    // Creating a new Object: ProjectCotent
    const orderedObject: ProjectContent = { aResum: "", bIntro: "", cObj: "", dMetod: "", eResult: "", fCons: "", gRef: "" };
    
    // For each ordered key, in their order, get the value from the same key of projContent
    orderedKeys.forEach((key) => {
      orderedObject[key] = this.selectedProject.content[key];
    });

    // With the copy now ordered and populated, pass it to projContent
    this.selectedProject.content = orderedObject;

  }

  handleError(errorMsg: string) {
    
    this.errorMsg = errorMsg;
    
    this.errorModalTrigger.nativeElement.click();
  }

  ngOnDestroy() {
    // Unsubscribing only if subscription exists
    if (this.userSubs) {
      this.userSubs.unsubscribe();
    }

    if (this.profileSubs) {
      this.profileSubs.unsubscribe();
    }

    if (this.postsSubs) {
      this.postsSubs.unsubscribe();
    }

  }
  
  private addEvents() {
    // Selecting element
    const textArea = this.selectedProjectContent.nativeElement;    

    // Checking if the element was created
    if (this.checkBoxes) {
      // Getting the element itself
      const checks = this.checkBoxes.nativeElement;
      
      // Getting its children
      const checkControls = checks.children;

      // For each .form-check, handle 
      for (let control of checkControls) {
        // Form check children
        const controlChildren = control.children;

        // Input itself
        const checkboxInput = controlChildren[0];

        // Add a callback attached to click
        checkboxInput.addEventListener("click", (event: any) => {
          // Clearing content
          textArea.innerHTML = "";

          // Event target
          let input = event.target;

          // Input label
          const checkboxLabel = input.nextElementSibling;

          // Label text
          const labelText = checkboxLabel.innerHTML;

          // Get selected working part
          const workingPart = this.loadProjectPart(labelText);

          // Verify checkbox
          if (input.checked) {
            // Add content if is checked
            this.selectedProjectText.push(this.selectedProject.content[workingPart]);
          } else {
            // Remove content if it isn't checked
            this.selectedProjectText = this.selectedProjectText.filter((element) => {
              return element !== this.selectedProject.content[workingPart];
            });
          }

          // Adding text to modal
          this.selectedProjectText.forEach(projectChapter => {
            textArea.innerHTML += projectChapter;
          });
          
        });
      }
      
    }
  }

  loadProjectPart(projPart: string): string {
    let contentKey = projPart;

    // Loading the project part selected
    switch (projPart.trim()) {
      case "Resumo":
        contentKey = "aResum";
      break;
      case "Introdução":
        contentKey = "bIntro";
      break;
      case "Objetivos":
        contentKey = "cObj";
      break;
      case "Metodologia":
        contentKey = "dMetod";
      break;
      case "Resultados":
        contentKey = "eResult";
      break;
      case "Considerações":
        contentKey = "fCons";
      break;
      case "Referências":
        contentKey = "gRef";
      break;
    }

    // Return the value of the key
    return contentKey;
  }

}