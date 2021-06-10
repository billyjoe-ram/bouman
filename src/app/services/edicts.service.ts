import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Edict } from '../interfaces/edict';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class EdictsService {
   
  private profilesCollection = this.store.collection('Profiles');

  constructor(
    private store: AngularFirestore,
    private authService: AuthService,
    private usersService: UsersService
  ) { }

  async addEdict(edict: Edict) {
    const edictsRef = this.profilesCollection.doc(edict.companyId).collection('Edicts');
    
    const edictAddedToColl = await edictsRef.add(edict);

    const addedEdict = edictsRef.doc(edictAddedToColl.id).update({ edictId: edictAddedToColl.id });
    
    return addedEdict;
  }  
  
  listCompanyEdicts(companyId: string) {
    const edictsRef = this.profilesCollection.doc(companyId).collection('Edicts');
    
    const companyEdicts = edictsRef.ref.get();
    
    return companyEdicts;
  }

  listEdict(companyId: string, edictId: string) {
    // Creating a reference to this doc
    const edictsRef = this.profilesCollection.doc(companyId).collection('Edicts');

    const companyEdict = edictsRef.doc(edictId).ref.get();

    // Returning that query
    return companyEdict;
  }

  applyToEdict(edict: Edict, profileId: string) {
    console.log(edict.companyId);
    console.log(profileId);

    let profilesApplied: string[] = edict.profilesApplied || [];

    // Going inside the company edicts
    const companyEdicts = this.profilesCollection.doc(edict.companyId).collection('Edicts');

    if (profilesApplied.includes(profileId)) {
      profilesApplied = profilesApplied.filter((profile) => {
        return profile !== profileId;
      });
    } else {
      profilesApplied.push(profileId);
    }

    // Updating edict
    const updatedEdict = companyEdicts.doc(edict.edictId).update({ profilesApplied: profilesApplied });
    
    // Returning the process promise
    return updatedEdict;
  }

  deleteEdict(edict: Edict) {
    const edictsRef = this.profilesCollection.doc(edict.companyId);

    const edictToDelete = edictsRef.collection('Edicts').doc(edict.edictId);

    const deletedEdict = edictToDelete.delete();

    return deletedEdict;
  }
  
}
