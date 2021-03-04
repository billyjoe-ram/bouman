import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IbgeService {

  private api: string = 'https://servicodados.ibge.gov.br/api/v1/localidades/';

  constructor(private http: HttpClient) { }

  public getStates() {
    return this.http.get(`${this.api}estados/`);
  }

  public getCities(id: number) {
    return this.http.get(`${this.api}estados/${id}/municipios`);
  }
}
