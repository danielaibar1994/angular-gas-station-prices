import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GasService {

  private baseUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  // /PreciosCarburantes/Listados/ProvinciasPorComunidad/10

  // getComunidadesAutonomas(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/Listados/ComunidadesAutonomas/`);
  // }

  getComunidadesAutonomas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Listados/ProvinciasPorComunidad/10`);
  }

  getMunicipios(idProv: string): Observable<any> {
    // EstacionesTerrestres/FiltroMunicipio/69944610
    return this.http.get(`${this.baseUrl}/Listados/MunicipiosPorProvincia/${idProv}`);
    // return this.http.get(`${this.baseUrl}/EstacionesTerrestres/FiltroMunicipio/6994`);
  }

  getPreciosMunicipio(municipio: number): Observable<any> {
    // EstacionesTerrestres/FiltroMunicipio/69944610
    // return this.http.get(`${this.baseUrl}/Listados/MunicipiosPorProvincia/4610`);
    municipio = 6994;
    return this.http.get(`${this.baseUrl}/EstacionesTerrestres/FiltroMunicipio/${municipio}`);
  }

  getPreciosProvincia(idProv: string): Observable<any> {
    // EstacionesTerrestres/FiltroMunicipio/69944610
    // return this.http.get(`${this.baseUrl}/Listados/MunicipiosPorProvincia/4610`);
    // municipio = 6994;
    return this.http.get(`${this.baseUrl}/EstacionesTerrestres/FiltroProvincia/${idProv}`);
  }

}
