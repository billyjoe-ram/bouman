import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private store: AngularFirestore) { }

  async searchProfile(userName: string) {
    const profiles: any[] = [];

    const collection = this.store.collection("Profiles").ref;

    const profile = (await collection.where("name", "==", userName).get()).forEach(profile => {
      console.log(profile);
      profiles.push(profile)
    });

    return profiles;
  }

}
