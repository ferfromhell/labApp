import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { UsuarioService } from "../../services/usuario.service";
import { NoticiasService } from "../../services/noticias.service";
import { ComponentesService } from "../../services/componentes.service";


import { MenuController } from '@ionic/angular';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
    public identity:any={};
    public token;
    public noticias:any;
  constructor(private _us:UsuarioService, private storages:Storage,private _ns:NoticiasService,private _cs:ComponentesService,private menu: MenuController) {

   }
   openFirst() {
     this.menu.enable(true, 'first');
     this.menu.open('first');
   }

   async ngOnInit() {
    await  this.identity_get();
    await  this.token_get();
    this.noticias_preview();
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

      noticias_preview(){
        this._ns.get_noticias(this.token).subscribe((res:any)=>{
          this.noticias = res.noticias;
          console.log(this.noticias);
        },(err:any)=>{

          if (err.status==0) {
            this._cs.toast('No hay conexión','Upss');
          }

        })
      }

       doRefresh(event){
         this.noticias_preview();
         setTimeout(() => {
           event.target.complete();
         }, 2000);
      }




}
