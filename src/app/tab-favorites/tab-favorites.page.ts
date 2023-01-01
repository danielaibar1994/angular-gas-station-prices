import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriteStorageService } from '../services/favorite-storage.service';
import { LocalStorageService } from '../services/parent/local-storage.service';

@Component({
  selector: 'app-tab-favorites',
  templateUrl: 'tab-favorites.page.html',
  styleUrls: ['tab-favorites.page.scss']
})
export class TabFavoritesPage implements OnInit {
  response = this.favoriteStorageService.myDataObservable$;
  constructor(private favoriteStorageService: FavoriteStorageService, private router: Router) { }

  ngOnInit(): void {
    this.initData();
  }

  goToMunicipio(cc: any) {
    this.router.navigate(['tabs', 'tab1', 'municipio'],
      { queryParams: { idProv: cc.IDProvincia, idMunicipio: cc.IDMunicipio, nameMunicipio: cc.Municipio } });
  }

  removeFavorite(cc: any) {
    this.favoriteStorageService.removeItem(cc);
  }

  private initData() {
    this.favoriteStorageService.loadInfo(this.favoriteStorageService.myLocalStorageTag);
  }
}
