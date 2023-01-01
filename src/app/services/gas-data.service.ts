import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, retry, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GasService } from './repository/gas-repository.service';


@Injectable({
  providedIn: 'root'
})
export class GasDataService {

  municipios = new BehaviorSubject<any[]>([]);
  readonly municipios$ = this.municipios.asObservable();

  prices = new BehaviorSubject<any>({});
  prices$ = this.prices.asObservable();

  private baseUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private gasService: GasService
  ) { }


  getComunidadesAutonomas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Listados/ProvinciasPorComunidad/10`);
  }


  getMunicipios$(idProv: string): void {
    this.gasService.getMunicipios(idProv).pipe(first()).subscribe(
      (res) => this.municipios.next(res)
    );
  }

  getFilteredMunicipios(evt): any[] {
    const dataFilter: any[] = [];

    const searchTerm = evt.srcElement.value.toLocaleLowerCase();
    const filteredString = searchTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    this.municipios.getValue().forEach(element => {
      const word = element.Municipio.toLocaleLowerCase();
      const filtered = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if ((filtered.indexOf(filteredString) > -1)) {
        dataFilter.push(element);
      }
    });

    return dataFilter;
  }

  getPreciosProvincia$(idProv: string): void {
    this.gasService.getPreciosProvincia(idProv).pipe(first(), retry(2)).subscribe(
      (res) => this.prices.next(res)
    );
  }

  getPreciosProvincia(idProv: string) {
    return this.gasService.getPreciosProvincia(idProv).pipe(first(), retry(2));
  }

  resetPrices(): void {
    this.prices.next({});

  }

}
