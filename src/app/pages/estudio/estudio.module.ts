import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstudioPageRoutingModule } from './estudio-routing.module';

import { EstudioPage } from './estudio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstudioPageRoutingModule
  ],
  declarations: [EstudioPage]
})
export class EstudioPageModule {}
