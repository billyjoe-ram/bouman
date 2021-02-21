import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedComponent } from './components/feed/feed.component';
import { LoginComponent } from './components/login/login.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { ConfigurateComponent } from './components/signup/configurate/configurate.component';
import { InfosComponent } from './components/signup/infos/infos.component';

const routes: Routes = [
  { path: '', redirectTo: "signup", pathMatch: 'full' },
  { path: 'feed', component: FeedComponent },
  { path: 'signup', component: InfosComponent, children: [
    { path: 'config',  component: ConfigurateComponent }
  ]},
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfilePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
