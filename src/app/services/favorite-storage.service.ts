import { Injectable } from '@angular/core';
import { LocalStorageService } from './parent/local-storage.service';


@Injectable({ providedIn: 'root' })
export class FavoriteStorageService extends LocalStorageService {
    myLocalStorageTag = 'myFavoriteStorage';
    storageType: 'ONE' | 'MULTIPLE' = 'MULTIPLE';
    parameterId = 'IDMunicipio';
    repeatedData = false;

    constructor() {
        super();
        this.loadInfo(this.myLocalStorageTag);
    }

    isFavorite(data: any): boolean {
        return this.myData$.getValue()?.some((item) => item[this.parameterId].toString() === data[this.parameterId].toString());
    }
}
