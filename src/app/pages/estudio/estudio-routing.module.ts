import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstudioPage } from './estudio.page';

const routes: Routes = [
  {
    path: '',
    component: EstudioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstudioPageRoutingModule {}
