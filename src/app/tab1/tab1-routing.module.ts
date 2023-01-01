import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MunicipioPage } from './municipio/municipio.page';
import { Tab1Page } from './tab1.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page,
  },
  {
    path: 'municipio',
    component: MunicipioPage
    // loadChildren: () => import('./municipio/paradas.module').then(m => m.ParadasPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule { }
