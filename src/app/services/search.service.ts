import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public searchParam: string = "";

  public searchResult: any[] = [];
  public profileResults: any[] = [];

  constructor(private store: AngularFirestore) { }

  async searchProfile(userName: string) {
    const search = this.searchParam.toLowerCase().split("+").join(" ");
    const profiles: any[] = [];

    const collection = this.store.collection("Profiles").ref;

    const profile = (await collection.where("name", "==", userName).get()).forEach(profile => {
      profiles.push(profile)
    });

    return profiles;
  }

  attrSearch(param: string) {
    this.searchParam = param;
  }

  async searchProjects() {
    const search = this.searchParam.toLowerCase().split("+").join(" ");

    const profilesCollec = this.store.collection("Profiles");
    const profiles = await profilesCollec.ref.get();
        
    let searchIndex: number = 0;
    
    profiles.forEach(async (profile) => {
      let profileId = profile.id;

      const postedProjectsCollec = profilesCollec.doc(profileId).collection("PostedProjects");
      const postedProjects = await postedProjectsCollec.ref.get();
      
      postedProjects.forEach(async (postedProject) => {
        if (postedProject.exists) {
          const searchPromise = await postedProjectsCollec.ref.where("keywords", "array-contains", search).get();

          searchPromise.forEach((result) => {
            this.searchResult[searchIndex] = result.data();

            searchIndex++;
          });
        }
      });
    });

  }

}
