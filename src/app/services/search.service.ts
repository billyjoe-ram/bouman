import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public searchParam: string = "";

  constructor(private store: AngularFirestore) { }

  async searchProfile(userName: string) {
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

  async searchByParam() {
    const search = this.searchParam.toLowerCase();

    const profilesCollec = this.store.collection("Profiles");
    const profiles = await profilesCollec.ref.get();

    let searchResult = [];
    
    profiles.forEach(async (profile) => {
      let profileId = profile.id;

      const postedProjectsCollec = profilesCollec.doc(profileId).collection("PostedProjects");
      const postedProjects = await postedProjectsCollec.ref.get();

      postedProjects.forEach((postedProject) => {
        console.log(profileId, "Exists posted projects?", postedProject.exists);

        if (postedProject.exists) {
          const searchPromise = postedProjectsCollec.ref.where("keywords", "array-contains", search).get();

          searchPromise.then((results) => {
            let index = 0;
            results.forEach((result) => {
              console.log(result.data());

              searchResult[index] = result.data();

              index++;
            })
          });
        }
      });      
    });

  }

}
