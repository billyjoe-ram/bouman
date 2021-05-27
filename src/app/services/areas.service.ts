import { Injectable } from '@angular/core';
import { Area } from '../interfaces/areas';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  // This is only temporary, in future the data will come from DB
  /*private areas: Area[] = [
    { name: 'Administração', value: 1 },
    { name: 'Arquitetura e Urbanismo', value: 2 },
    { name: 'Ciências Biológicas', value: 3 },
    { name: 'Ciências Contábeis', value: 4 },
    { name: 'Ciências Econômicas', value: 5 },
    { name: 'Computação e Informática', value: 6 },
    { name: 'Comunicação Social', value: 7 },
    { name: 'Design', value: 8 },
    { name: 'Direito', value: 9 },
    { name: 'Ecologia', value: 10 },
    { name: 'Educação Física', value: 11 },
    { name: 'Engenharia', value: 12 },
    { name: 'Fármacia', value: 13 },
    { name: 'Filosofia', value: 14 },
    { name: 'Física', value: 15 },
    { name: 'Fisioterapia', value: 16 },
    { name: 'Geografia', value: 17 },
    { name: 'Geologia', value: 18 },
    { name: 'História', value: 19 },
    { name: 'Letras', value: 20 },
    { name: 'Matemática', value: 21 },
    { name: 'Meteorologia', value: 22 },
    { name: 'Oceanografia', value: 23 },
    { name: 'Odontologia', value: 24 },
    { name: 'Pedagogia', value: 25 },
    { name: 'Psicologia', value: 26 },
    { name: 'Química', value: 27 },
    { name: 'Serviço Social', value: 28 },
    { name: 'Outros', value: 0 }
  ];*/
  
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

  // Adding only to the array
  /*addArea(area: Area) {
    this.areas.push(area);
  }*/
}
