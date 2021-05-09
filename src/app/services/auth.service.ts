import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Path to users collection
  private userCollection = this.store.collection<User>('Users');

  // Importing AngularFire modules
  constructor(private ngAuth: AngularFireAuth, private store: AngularFirestore) { }

  // Logging with email and password
  login(user: User) {
    return this.ngAuth.signInWithEmailAndPassword(user.email, user.password);
  }
  
  // Creating user with email and password
  register(user: User) {
    return this.ngAuth.createUserWithEmailAndPassword(user.email, user.password);    
  }

  // Adding to the users collection (for after creating user)
  addUser(user: User) {
    return this.userCollection.add(user);
  }
  
  // Logging out
  logout() {
    return this.ngAuth.signOut();
  }

  // Getting authentication methods / attributes
  getAuth() {
    return this.ngAuth;
  }

}
