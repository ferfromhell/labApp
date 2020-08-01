import { Component, OnInit } from '@angular/core';
import { CarritoModel } from "../../models/carrito";
import { Storage } from "@ionic/storage";
import { LoadingController,ToastController,AlertController,NavController  } from '@ionic/angular';
import { CarritoService } from "../../services/carrito.service";
import { PedidosService } from "../../services/pedidos.service";
import { DireccionService } from "../../services/direccion.service";
import { SucursalesService } from "../../services/sucursales.service";
import { ModalController } from '@ionic/angular';
import { DireccionModalPage } from '../direccion-modal/direccion-modal.page';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
declare var google;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  public identity;
  public token;
  public estudios_html:any=[];
  public direcciones:any=[];
  public costos_viaje:any;

  public direc_selected:any;
  public sucursal_selected:any;

  public subtotal=0;
  public total_pago:any;

  direccion_value:any;
  direccion_text:any;

  directionsService: any = null;
  constructor(public alertController: AlertController,private storages:Storage,private _cs:CarritoService, public loadingController: LoadingController,public toastController: ToastController,
  public modalController: ModalController,public _ds:DireccionService,public _ps:PedidosService,private navCtrl:NavController,private _sus:SucursalesService) {
    this.directionsService = new google.maps.DirectionsService();
  }

    async  ngOnInit() {
       await  this.identity_get();
       await  this.token_get();
       this.cargar_direccion();
       this.get_sc_estudios();
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
     async toast(message,header) {
       const toast = await this.toastController.create({
         header: header,
         position: 'top',
         message: message,
         duration: 3200
       });
       toast.present();
     }
     async presentModal() {
     const modal = await this.modalController.create({
        component: DireccionModalPage,
        cssClass: 'my-custom-class',
        swipeToClose: true,
        animated:true

      });
       await modal.present();
      const {data} = await modal.onDidDismiss();
      this.refresh(data);
    }

     refresh(data){
      console.log(data);
      if (data==true) {
        this.cargar_direccion();
      }
    }

     showLoader() {

        this.loadingController.create({
          message: ''
        }).then((res) => {
          res.present();
        });
      }
     hideLoader(){
        this.loadingController.dismiss().then((loading) => {
        });
      }

     get_sc_estudios(){
       this.showLoader();
       this._cs.get_estudios(this.token).subscribe(response=>{
         let res:any = response;
         this.subtotal = 0;
         res.carrito.forEach(element => {
          this.subtotal += element.estudio.costo;
         });

         this.estudios_html = res.carrito;
         this.hideLoader();
       },err=>{
         this.hideLoader();
         let message="Vuelve a intentarlo nuevamente";
         let header ="Algo sucedio...";
         this.toast(message,header);
       })
     }

     delete_estudio(estudio){

       this._cs.delte_carrito_item(this.token,estudio.id).subscribe(res=>{
         this.get_sc_estudios();
       },err=>{

         let message="Vuelve a intentarlo nuevamente";
         let header ="Algo sucedio...";
         this.toast(message,header);
       });
     }
     cargar_direccion(){

       this._ds.get_direccion(this.token).subscribe(response=>{
         console.log(response);
         let res:any = response;
         this.direcciones=res.direccion;
       },err=>{
         let message="Vuelve a intentarlo nuevamente las direcciones fallaron";
         let header ="Algo sucedio...";
         this.toast(message,header);
       })
     }

     async confirmarPedido() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Confirmación',
        message: '¿Seguro que deseas solicitar el pedido?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Operación Cancelada');
            }
          }, {
            text: 'Solicitar',
            handler: () => {
              this.verify_distance();
        //      this.emitir_pedido();
            }
          }
        ]
      });

      await alert.present();
    }

    async  checkValue(event){
      let index = event.detail.value;
      this.direc_selected=this.direcciones[index]
      await this.validate_distancia();
      //this.prueba();
    }

    emitir_pedido(){
      let estudios=[];
      this.estudios_html.forEach(element => {
        estudios.push(element.estudio.id);
      });

      let data ={
        estudios:estudios,
        id_direccion:this.direc_selected.id,
        total_viaje:this.costos_viaje.costo,
        total_estudios: this.subtotal,
        total:(this.costos_viaje.costo+this.subtotal)
      }

      this._ps.pedido(this.token,data).subscribe(response=>{
        let message="En un momento alguien de asistencia se comunicara contigo";
        let header ="Solicitud enviada";
        this.toast(message,header);
        this.navCtrl.navigateRoot('tabs/pedidos');
      },err=>{
        let message="Vuelve a intentarlo nuevamente";
        let header ="Algo sucedio...";
        this.toast(message,header);
      })
    }


    verify_distance(){
      if (this.direc_selected==undefined) {
        let message="Selecciona una dirección";
        let header ="Falta algo más";
        this.toast(message,header);
        return;
      }
      this.directionsService.route({
        origin: new google.maps.LatLng(19.051124,-98.231325),
        destination: new google.maps.LatLng(this.direc_selected.latitud, this.direc_selected.longitud),
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true
      }, (response, status)=> {
        console.log(response);
        if(status === google.maps.DirectionsStatus.OK) {


          let distancia = response.routes[0].legs[0].distance.value;
          let distancia_km = response.routes[0].legs[0].distance.text;
          var statu;
          var costo = 0;
          if (distancia <= 5000) {
            statu = 'aprobado'
            costo = 0;
          }else if (distancia>5000 && distancia<10000) {
            costo = 100;
            statu = 'aprobado';
          }else if (distancia>10000 && distancia <15000) {
            costo = 150;
            statu ='aprobado';
          }else if(distancia>15000){
            costo = 0;
            statu = 'invalido';
          }

          this.costos_viaje = {
           estado:statu,
           costo:costo
         }
          if (statu == 'aprobado') {
            this.emitir_pedido();
          }else{
            let message="El pedido no se puede ejecutar en esa direccion";
            let header ="Limite no establecido";
            this.toast(message,header);
          }

        }else{

        }
      });

    }

    validate_distancia(){
      this.total_pago = '';
      if (this.direc_selected!=undefined) {
        this.directionsService.route({
          origin: new google.maps.LatLng(19.051124,-98.231325,),
          destination: new google.maps.LatLng(this.direc_selected.latitud, this.direc_selected.longitud),
          travelMode: google.maps.TravelMode.DRIVING,
          avoidTolls: true
        }, (response)=> {

            this.direccion_value = response.routes[0].legs[0].distance.value;
            this.direccion_text = response.routes[0].legs[0].distance.text;

        });
      }
    }

    doRefresh(event){
        this.cargar_direccion();
        this.get_sc_estudios();
        setTimeout(() => {
        event.target.complete();
      }, 1500);
    }
    //
    async toast_2(message,header) {
      const toast = await this.toastController.create({
        header: header,
        position: 'top',
        message: message,
        duration: 6500
      });
      toast.present();
    }

    prueba(){
      var distancia =  this.direccion_value;
      if (distancia==undefined) {
        this.toast_2('Selecciona la direccion','');

      }else{
        var statu;
        var viaje:any ='Sin Costo';
        if (distancia <= 5000) {
          statu = 'aprobado'
          viaje = '';
        }else if (distancia>5000 && distancia<10000) {
          viaje = 100;
          statu = 'aprobado';
        }else if (distancia>10000 && distancia <15000) {
          viaje = 150;
          statu ='aprobado';
        }else if(distancia>15000){
          statu = 'invalido';
          viaje = "El pedido no se puede realizar deibido a que esta fuera de los limites establecidos";
        }
        if (statu=="aprobado") {
          this.total_pago = 'Total: ' + (viaje + this.subtotal);
        }else{
          this.total_pago = viaje;
        }
      }
    }


}
