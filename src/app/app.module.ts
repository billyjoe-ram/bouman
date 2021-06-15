import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import ptBR from "@angular/common/locales/pt"

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

import { EditorModule } from '@tinymce/tinymce-angular';

import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectOverviewComponent } from './components/projects/project-overview/project-overview.component';
import { ProjectComponent } from './components/projects/project-overview/project/project.component';
import { ProfileConfigComponent } from './components/profile-page/profile-config/profile-config.component';

import { environment } from 'src/environments/environment.prod';
import { registerLocaleData } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ContactComponent } from './components/profile-page/contact/contact.component';
import { FaqComponent } from './components/faq/faq.component';
import { PostProjectComponent } from './components/feed/post-project/post-project.component';
import { ProjectCardComponent } from './components/profile-page/project-card/project-card.component';
import { TermsComponent } from './components/terms/terms.component';
import { LicenseComponent } from './components/terms/license/license.component';
import { PrivacyComponent } from './components/terms/privacy/privacy.component';
import { AccountComponent } from './components/terms/account/account.component';
import { AddPeopleComponent } from './components/projects/project-overview/project/add-people/add-people.component';
import { EdictsComponent } from './components/edits/edits.component';
import { EditComponent } from './components/edits/edit/edit.component';
import { OverviewComponent } from './components/edits/overview/overview.component';
// import { NgxMaskModule } from 'ngx-mask';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { EdictCardComponent } from './components/profile-page/edict-card/edict-card.component';
import { SearchResultsComponent } from './components/header/search-results/search-results.component';

registerLocaleData(ptBR);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
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
    ProjectComponent,
    ProfileConfigComponent,
    NotFoundComponent,
    ContactComponent,
    PostProjectComponent,
    ProjectCardComponent,
    FaqComponent,
    TermsComponent,
    PrivacyComponent,
    AccountComponent,
    LicenseComponent,
    AddPeopleComponent,
    EdictsComponent,
    EditComponent,
    OverviewComponent,
    SpinnerComponent,
    EdictCardComponent,
    SearchResultsComponent
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
    // NgxMaskModule.forRoot(),
  ],
  providers: [ { provide: LOCALE_ID, useValue: "pt-BR" } ],
  bootstrap: [AppComponent],
})
export class AppModule {}
