import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { NavController } from "@ionic/angular";
import { ComponentesService } from "../../services/componentes.service";
@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {
  public identity:any={};
  public token;
  public image:string;
  constructor(private navCtrl:NavController, private storages:Storage,public _sc:ComponentesService) {
    this.image = 'assets/descarga.png'
   }

  async  ngOnInit() {
     await  this.identity_get();
     await  this.token_get();
     this.image = this.identity.imagen_perfil;
     }


     async identity_get(){
        await this.storages.get('identity').then((data) => {
        this.identity=data;
       });
     }
     async token_get(){
       await this.storages.get('token').then((data) => {
            this.token = data;
          });
     }

     log_out(){
       this.storages.remove('token');
       this.storages.remove('identity');
       this.navCtrl.navigateRoot('/login');
       this._sc.toast("Sesión Finalizada")
     }
     async doRefresh(event){
        await this.ngOnInit();
        setTimeout(() => {
          event.target.complete();
        }, 2000);
     }

}
