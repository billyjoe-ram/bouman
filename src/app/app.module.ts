import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppRoutingModule } from './app-routing.module';

import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { RecipeListComponent } from './components/recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './components/recipes/recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './components/recipes/recipe-list/recipe-item/recipe-item.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './components/shopping-list/shopping-edit/shopping-edit.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
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
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
