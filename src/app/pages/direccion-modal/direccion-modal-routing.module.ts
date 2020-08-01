import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DireccionModalPage } from './direccion-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DireccionModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DireccionModalPageRoutingModule {}
