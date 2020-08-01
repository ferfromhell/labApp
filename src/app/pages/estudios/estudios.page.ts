import { Component, OnInit, ViewChild } from '@angular/core';
import { EstudiosService } from "../../services/estudios.service";
import { CarritoModel } from "../../models/carrito";

import { Storage } from "@ionic/storage";
import { LoadingController,ToastController,IonList } from '@ionic/angular';

@Component({
  selector: 'app-estudios',
  templateUrl: './estudios.page.html',
  styleUrls: ['./estudios.page.scss'],
})
export class EstudiosPage implements OnInit {
  @ViewChild('lista',{static: false}) lista: IonList;
  public identity;
  public token;
  public estudios=[];
  public page=1;
  public last_page;
  public total_estudios;
  public carrito:CarritoModel;
  public stack=0;
  public direccion;

  constructor(private _es:EstudiosService,private storages:Storage,public loadingController: LoadingController,public toastController: ToastController) {
    this.carrito = new CarritoModel('','');

  }

async  ngOnInit() {
   await  this.identity_get();
   await  this.token_get();
   this.cargar_estudios(true);
   this.stack_carrito();
   }
   doRefresh(event){
      setTimeout(() => {
        this.stack_carrito();
        event.target.complete();
      }, 1500);
   }

   ionViewWillEnter(){
     this.stack_carrito();
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

   showLoader(){
      this.loadingController.create({
        message: 'Cargando...'
        }).then((res) => {
         res.present();
      });
    }

   hideLoader(){
      this.loadingController.dismiss().then((loading) => {
      });
    }

   async toast(message,header) {
      const toast = await this.toastController.create({
        header: header,
        position: 'bottom',
        message: message,
        duration: 2200
      });
      toast.present();
    }

   cargar_estudios(loader = true){
     if (loader == true) {
        this.showLoader();
     }
      this._es.get_estudios(this.token,this.page).subscribe(response=>{
        var res:any = response;
        if (res.status=="success") {
          console.log(res.estudios);
          this.estudios = res.estudios.data;
          this.hideLoader();
          this.page += 1;
          this.last_page = res.estudios.last_page;
          this.total_estudios = res.estudios.total_estudios;
        }
      },err=>{
          this.hideLoader();
          if (err.status==0) {
            this.toast('No hay conexión','Upss');
          }else{
          let message="Hubo algún error, vuelve a intentarlo nuevamente";
          let header = "Upss...";
          this.toast(message,header);
         }

      })
   }

   loadData(event){
     if (this.page <= this.last_page) {
       this._es.get_estudios(this.token,this.page).subscribe(response=>{
         var res:any = response;
         if (res.status=="success") {
           this.estudios.push(...res.estudios.data);
           this.page += 1;
           event.target.complete();
         }
       })
     }else{
        let message="Sin más estudios que mostrar";
        let header = "Atención";
        this.toast(message,header);
        event.target.complete();
     }

   }

   buscar(event){
     let text_search  =event.detail.value;
     if (text_search!='') {
       this._es.search_estudios(this.token,text_search).subscribe(
         response=>{
           console.log(response);

          var res:any = response;
          if (res.status=="success") {
            if (res.estudios.data.length > 0) {
              this.estudios=res.estudios.data;
            }else{
              this.estudios=[];
              let message="No se encontro el estudio en la busqueda";
              let header = '';
              this.toast(message,header);
            }

         }
       },err=>{
         let message="Hubo algún error, vuelve a intentarlo nuevamente";
         let header = "Upss...";
         this.toast(message,header);
       })
     }else{
       this.estudios=[];
       this.page=1;
       this.cargar_estudios(false);

     }

   }
   // NOTE: Cargar estudios al carrito
   agregar_carrito(estudio){
     this.carrito.id = estudio.id;
     this.carrito.costo = estudio.costo;
     this.lista.closeSlidingItems();
     this._es.carrito_add(this.token,this.carrito).subscribe(res=>{
       this.stack += 1;
       let message = "Puedes visualizar el estudio en tu carrito."
       let header = "Se agrego correctamente."
       this.toast(message,header)
     },err=>{
       let message = "Asegurate de tener conexión a internet e intentalo de nuevo."
       let header = "Error"
       this.toast(message,header)

     });
   }
   stack_carrito(){
     this._es.count_stack(this.token).subscribe(res=>{
       let response:any = res;
       this.stack=response.carrito;
     },err=>{

     });
   }
}
