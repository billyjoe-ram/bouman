import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedComponent } from './components/feed/feed.component';
import { LoginComponent } from './components/login/login.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { ConfigurateComponent } from './components/signup/configurate/configurate.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectOverviewComponent } from './components/projects/project-overview/project-overview.component';
import { ProjectComponent } from './components/projects/project-overview/project/project.component';
import { ProfileConfigComponent } from './components/profile-page/profile-config/profile-config.component';

const routes: Routes = [
  { path: '', redirectTo: "feed", pathMatch: 'full' },
  { path: 'feed', component: FeedComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [LoginGuard] },
  { path: 'config',  component: ConfigurateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard] },
  { path: 'profile-config', component: ProfileConfigComponent, canActivate: [AuthGuard] },
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard], children: [
    { path: 'overview', component: ProjectOverviewComponent },
    { path: ':id', component: ProjectComponent }
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
