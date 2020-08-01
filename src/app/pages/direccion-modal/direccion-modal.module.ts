import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DireccionModalPageRoutingModule } from './direccion-modal-routing.module';

import { DireccionModalPage } from './direccion-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DireccionModalPageRoutingModule
  ],
  declarations: [DireccionModalPage]
})
export class DireccionModalPageModule {}
