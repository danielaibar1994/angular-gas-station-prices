/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Config } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { GasDataService } from 'src/app/services/gas-data.service';

@Component({
  selector: 'app-municipio',
  templateUrl: 'municipio.page.html',
  styleUrls: ['municipio.page.scss'],
})
export class MunicipioPage implements OnInit {

  // query params
  idProv: string;
  idMunicipio: number;
  nameMunicipio: string;

  selectedMunicipio: any;
  rangeDistance = 10;
  segmentTab = 'distance';
  notFound = false;

  pricesList: any;
  responseFiltered = [];
  ios: boolean;
  constructor(
    private gasDataService: GasDataService,
    private route: ActivatedRoute,
    public config: Config
  ) { }

  ngOnInit(): void {
    this.ios = this.config.get('mode') === 'ios';
    this.getDataFromUrl();
  }

  rangeChanged(event) {
    console.log(event); // generate double call
    this.searchGasStationsByRange();
  }

  segmentChanged(event) {
    console.log(event);
    this.searchGasStationsByRange();
  }

  getDataFromUrl() {
    this.idProv = String(this.route.snapshot.queryParamMap.get('idProv'));
    this.idMunicipio = Number(
      this.route.snapshot.queryParamMap.get('idMunicipio')
    );
    this.nameMunicipio = String(this.route.snapshot.queryParamMap.get('nameMunicipio'));
    this.initData();
  }

  private asTheCrowFlies(lat1: any, lon1: any, lat2: any, lon2: any) {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres

    return d / 1000;
  }

  private initData() {
    this.gasDataService
      .getPreciosProvincia(this.idProv)
      .pipe(first())
      .subscribe(
        (res) => {
          if (res?.ListaEESSPrecio) {
            this.pricesList = res.ListaEESSPrecio;
            this.searchSelectedMunicipioData();
          }
        },
        (err) => {
          console.error('Not available: ', err);
        }
      );
  }

  private searchSelectedMunicipioData() {
    this.selectedMunicipio = null;
    this.notFound = false;

    if (!!this.pricesList?.length) {
      const found = this.pricesList.find(
        (element) => element.IDMunicipio === this.idMunicipio.toString()
      );

      if (found) {
        this.selectedMunicipio = found;
        this.searchGasStationsByRange();
      } else {
        this.notFound = true;
      }
    }
  }

  private searchGasStationsByRange() {
    this.responseFiltered = [];

    if (this.selectedMunicipio) {
      this.pricesList.forEach((element) => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        const lat1 = parseFloat(
          this.selectedMunicipio.Latitud.replace(/,/g, '.')
        );
        const long1 = parseFloat(
          this.selectedMunicipio['Longitud (WGS84)'].replace(/,/g, '.')
        );

        const lat2 = parseFloat(element.Latitud.replace(/,/g, '.'));
        const long2 = parseFloat(
          element['Longitud (WGS84)'].replace(/,/g, '.')
        );
        const distance = this.asTheCrowFlies(lat1, long1, lat2, long2);

        if (distance <= this.rangeDistance) {
          element.distance = distance;
          this.responseFiltered.push(element);
        }
      });
    }

    if (!!this.responseFiltered.length) {
      if (this.segmentTab.includes('distance')) {
        this.sortByDistance();
      } else {
        this.sortByPrice();
      }
    }
  }

  private sortByDistance() {
    this.responseFiltered.sort((a: any, b: any) => {
      if (a.distance > b.distance) {
        return 1;
      } else if (a.distance < b.distance) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  private sortByPrice() {
    this.responseFiltered.sort((a: any, b: any) => {
      const priceA = parseFloat(a['Precio Gasoleo A'].replace(/,/g, '.'));
      const priceB = parseFloat(b['Precio Gasoleo A'].replace(/,/g, '.'));

      if (priceA > priceB) {
        return 1;
      } else if (priceA < priceB) {
        return -1;
      } else {
        return 0;
      }
    });
  }
}
