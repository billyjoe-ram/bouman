import { Injectable } from '@angular/core';
import { Area } from '../interfaces/areas';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  constructor(private store: AngularFirestore) { }

  // Getting Areas
  async getAreas() {
    const areasStore = this.store.collection("Fapesp");
    const areasCollection = await areasStore.ref.get();
    const areas : any[] = [];
    let index = 0;
    areasCollection.forEach((area) => {
      areas[index] = area.data();
      index ++;
    });

    return areas;
  }

  async getSubarea(area: string){
    const subareasStore = this.store.collection("Fapesp").doc(area).collection("Subareas");
    const subareasCollection = await subareasStore.ref.get();
    const subareas : any[] = [];
    let index = 0;
    subareasCollection.forEach((subarea) => {
      subareas[index] = subarea.data();
      index ++;
      console.log('Subarea da Service:');
      console.log(subarea);
    });

    return subareas;
  }

  async getProjectAreas(area: string, subarea: string){

  }

  // Adding only to the array
  /*addArea(area: Area) {
    this.areas.push(area);
  }*/
}
