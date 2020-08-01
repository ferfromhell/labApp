import { Component, OnInit } from '@angular/core';
import { PedidosService } from "../../services/pedidos.service";
import { ComponentesService } from "../../services/componentes.service";
import { Storage } from "@ionic/storage";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
  public identity;
  public token;
  public pedidos:any=[];
  public anteriores:any=[];
  public segment:string = 'pendientes';
  constructor(private _ps:PedidosService, private _cs:ComponentesService,private storages:Storage,public alertController: AlertController) { }


    async  ngOnInit() {
       await  this.identity_get();
       await  this.token_get();
       this.get_pedidos();
       this.get_anteriores();
     }
     ionViewWillEnter(){
       this.get_pedidos();
       this.get_anteriores();
     }
     //
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

     get_pedidos(){
       this._ps.ver_pedidos(this.token).subscribe(response=>{
         var res:any = response;
         this.pedidos=res.pedido;
         console.log(response);

       },err=>{
         console.log(err);

       })
     }
     segmentChanged(event){
       let menu = event.detail.value;
       if(menu == 'anteriores'){
         this.segment='anteriores';
       }else if (menu == 'pendientes') {
         this.segment='pendientes';
       }
     }

     get_anteriores(){
       this._ps.ver_anteriores(this.token).subscribe(
         (res:any)=>{
           this.anteriores=res.pedido;
           console.log(this.anteriores);

         }
       )
     }
     async comentarios(pedido){
         const alert = await this.alertController.create({
           cssClass: 'my-custom-class',
           header: 'Tus comentarios nos ayudarian a mejorar nuestro servicio',
           inputs: [
             {
               name: 'comentarios',
               type: 'textarea',
               placeholder: 'Comentarios'
             }
           ],
           buttons: [
             {
               text: 'Cancelar',
               role: 'cancel',
               cssClass: 'secondary',
               handler: (event) => {
                 console.log('Confirm Cancel');
               }
             }, {
               text: 'Enviar',
               handler: (event) => {
                 let coment=event.comentarios;
                 let data = {
                   id: pedido,
                   comentarios:coment
                 }
                 this._ps.coment(this.token,data).subscribe(
                   (res:any)=>{
                     this._cs.toast('Gracias por tus comentarios')
                   },err=>{
                     this._cs.toast('Intentalo más tarde','¡Algo ocurrio!')
                   }
                 )

               }
             }
           ]
         });
         await alert.present();
     }

     async doRefresh(event){
        await this.ngOnInit();
        setTimeout(() => {
          event.target.complete();
        }, 2000);

     }


}
