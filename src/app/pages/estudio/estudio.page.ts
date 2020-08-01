import { Component, OnInit } from '@angular/core';
import { ActivatedRoute  } from '@angular/router';
import { Storage } from "@ionic/storage";
import { EstudiosService } from "../../services/estudios.service";
import { LoadingController,ToastController } from '@ionic/angular';
import { CarritoModel } from "../../models/carrito";

@Component({
  selector: 'app-estudio',
  templateUrl: './estudio.page.html',
  styleUrls: ['./estudio.page.scss'],
})
export class EstudioPage implements OnInit {
  public identity;
  public token;
  public estudio:any={};
  public carrito:CarritoModel;
  constructor(private _es:EstudiosService, private _aRoute:ActivatedRoute,private storages:Storage,public toastController: ToastController) {
    this.carrito = new CarritoModel('','');
   }


  async  ngOnInit() {
     await  this.identity_estudio();
     await  this.token_estudio();
     var id = this._aRoute.snapshot.paramMap.get('id');

     this.see_estudio(this.token,id);
     }

     async identity_estudio(){
        await this.storages.get('identity').then((data) => {
        this.identity=data;
       });
     }
     async token_estudio(){
       await this.storages.get('token').then((data) => {
            this.token = data;
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

     see_estudio(token,id){
       this._es.get_estudio(this.token,id).subscribe(response=>{
         var res:any = response;
         if (res.status=='success') {
           this.estudio = res.estudio;
         }
       },err=>{
         if (err.status==0) {
           this.toast('No hay conexión','Upss');
         }else{
           let message="Hubo algún error, vuelve a intentarlo nuevamente";
           let header = "Upss...";
           this.toast(message,header);
         }

       })
     }

     // NOTE: Cargar estudios al carrito
     agregar_carrito(estudio){
       this.carrito.id = estudio.id;
       this.carrito.costo = estudio.costo;
       console.log(this.carrito);

       this._es.carrito_add(this.token,this.carrito).subscribe(res=>{
         let message = "Puedes visualizar el estudio en tu carrito."
         let header = "Se agrego correctamente."
         this.toast(message,header)
       },err=>{
         console.log(err);

         let message = "Asegurate de tener conexión a internet e intentalo de nuevo."
         let header = "Error"
         this.toast(message,header)

       });
     }

}
