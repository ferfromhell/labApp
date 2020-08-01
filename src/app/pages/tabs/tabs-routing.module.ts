import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:[
      {
        path:'inicio',
        loadChildren: () => import('../inicio/inicio.module').then( m => m.InicioPageModule)
      },
      {
        path:'estudios',
        loadChildren: () => import('../estudios/estudios.module').then( m => m.EstudiosPageModule)
      },
      {
        path:'pedidos',
          loadChildren: () => import('../pedidos/pedidos.module').then( m => m.PedidosPageModule)
      },
      {
        path:'cuenta',
        loadChildren: () => import('../cuenta/cuenta.module').then( m => m.CuentaPageModule)
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
