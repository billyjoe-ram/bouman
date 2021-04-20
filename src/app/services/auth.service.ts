import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userCollection = this.store.collection<User>('Users');

  constructor(private ngAuth: AngularFireAuth, private store: AngularFirestore) { }

  login(user: User) {
    return this.ngAuth.signInWithEmailAndPassword(user.email, user.password);
  }
  
  register(user: User) {
    return this.ngAuth.createUserWithEmailAndPassword(user.email, user.password);    
  }

  addUser(user: User) {
    return this.userCollection.add(user);
  }
  
  logout() {
    return this.ngAuth.signOut();
  }

  getAuth() {
    return this.ngAuth;
  }

}
