import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FavoriteStorageService } from '../services/favorite-storage.service';
import { GasDataService } from '../services/gas-data.service';
import { GasService } from '../services/repository/gas-repository.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  response: Observable<any>;
  loadedDataFilter: any[];
  searchNotFound = false;
  loading = false;

  provinceIdSelect = '46';
  constructor(private gasDataService: GasDataService, private route: ActivatedRoute,
    private router: Router, private favoriteStorageService: FavoriteStorageService, private toastController: ToastController) { }

  ngOnInit(): void {
    this.initData();
  }

  goToMunicipio(cc: any) {
    this.router.navigate(['tabs', 'tab1', 'municipio'],
      { queryParams: { idProv: cc.IDProvincia, idMunicipio: cc.IDMunicipio, nameMunicipio: cc.Municipio } });
  }

  selectProvinceChange() {
    this.initData();
  }

  async addFavorite(cc: any, item: any) {
    this.favoriteStorageService.setInfo({ ...cc });
    item.close();

    const toast = await this.toastController.create({
      message: 'Añadido a favoritos!',
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

  async removeFavorite(cc: any, item: any) {
    this.favoriteStorageService.removeItem({ ...cc });
    item.close();

    const toast = await this.toastController.create({
      message: 'Eliminado!',
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

  isFavorite(cc): boolean {
    return this.favoriteStorageService.isFavorite(cc);
  }

  filterList(evt) {
    this.searchNotFound = false;
    this.loading = true;

    this.loadedDataFilter = this.gasDataService.getFilteredMunicipios(evt);
    this.searchNotFound = this.loadedDataFilter.length < 1;
    this.loading = false;
  }

  private initData() {
    this.loadedDataFilter = null;
    this.response = this.gasDataService.municipios$;
    this.gasDataService.getMunicipios$(this.provinceIdSelect);
  }

}
