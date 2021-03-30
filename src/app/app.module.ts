import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfileCardComponent } from './components/profile-page/profile-card/profile-card.component';
import { PublicationCardComponent } from './components/feed/publication-card/publication-card.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { FeedComponent } from './components/feed/feed.component';
import { SignupComponent } from './components/signup/signup.component';
import { ConfigurateComponent } from './components/signup/configurate/configurate.component';
import { SecondaryHeaderComponent } from './components/secondary-header/secondary-header.component';
import { InfosComponent } from './components/signup/infos/infos.component';
import { LoginComponent } from './components/login/login.component';

import { DropdownDirectiveDirective } from './directives/dropdown-directive.directive';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectOverviewComponent } from './components/projects/project-overview/project-overview.component';
import { ProjectEditComponent } from './components/projects/project-edit/project-edit.component';
import { ProjectComponent } from './components/projects/project-overview/project/project.component';
import { ProfileConfigComponent } from './components/profile-page/profile-config/profile-config.component';
import { environment } from 'src/environments/environment.prod';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropdownDirectiveDirective,
    ProfileCardComponent,
    PublicationCardComponent,
    ProfilePageComponent,
    FeedComponent,
    SignupComponent,
    ConfigurateComponent,
    SecondaryHeaderComponent,
    InfosComponent,
    LoginComponent,
    ProjectsComponent,
    ProjectOverviewComponent,
    ProjectEditComponent,
    ProjectComponent,
    ProfileConfigComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule,
    EditorModule,
    AngularEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
