import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ComponentesService } from "../../services/componentes.service";
import { PedidosService } from "../../services/pedidos.service";
import { interval,Subscription } from 'rxjs';
declare var google;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {


  directionsService: any = null;
  directionsDisplay: any = null;
  bounds: any = null;
  myLatLng: any;

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;

  latitude: number;
  longitude: number;
  inicio_lat:number=19.051241;
  inicio_long:number=-98.231636;
  subscription:any;

  pedido:any=false;

  public identity:any={};
  public token;

  constructor(private storages:Storage,private geolocation: Geolocation,private _cs:ComponentesService ,private nativeGeocoder: NativeGeocoder,private _ps:PedidosService) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();

  }

  ionViewDidLeave(){
    if (this.subscription) {
         this.subscription.unsubscribe();
    }

  }
  async doRefresh(event){
      await  this.cargar_direccion();
      await  this.cantidad_pedidos();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }



  async ngOnInit() {
   await  this.token_get();
   await  this.identity_get();
   this.cargar_direccion();
  this.cantidad_pedidos();



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

  loadMap() {
     this.geolocation.getCurrentPosition().then((resp) => {


       let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

       if (this.pedido == false) {
         this.latitude=resp.coords.latitude;
         this.longitude=resp.coords.longitude;
       }

       let mapOptions = {
         center: latLng,
         zoom: 15,
         mapTypeId: google.maps.MapTypeId.ROADMAP
       }

       // this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


       this.directionsDisplay.setMap(this.map);

       // // adds the marker on the map
       this.calculateRoute();
     }).catch((error) => {
       console.log('Error getting location', error);
     });
   }
  private calculateRoute(){

    this.directionsService.route({
      origin: new google.maps.LatLng(this.inicio_lat,this.inicio_long),
      destination: new google.maps.LatLng(this.latitude, this.longitude),
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true
    }, (response, status)=> {
      if(status === google.maps.DirectionsStatus.OK) {

        this.directionsDisplay.setDirections(response);
      }else{
        alert('Could not display directions due to: ' + status);
      }
    });

}

  cantidad_pedidos(){
    this._ps.cantidad(this.token).subscribe((res:any)=>{
      var cantidad = res.cantidad;
      if (cantidad>0) {

        this.loadMap();
        this.ubicacion_quimico();
        this.timer_set();
        let message = 'En caso de ser necesario el quimico realizara una llamada';
        let header = "Hola";
        this._cs.toast(message,header,5900);
      }else{
        this.loadMap();
        let message = 'No hay estudios pendientes';
        let header = "Hola";
        this._cs.toast(message,header,5900);
      }

    });
  }

  ubicacion_quimico(){
    this._ps.ubicacion(this.token).subscribe((res:any)=>{
      var ubicacion = res.ubicacion;
       this.inicio_long = ubicacion.longitud;
       this.inicio_lat = ubicacion.latitud;
       this.calculateRoute();
    })
  }

  timer_set(){
    const source = interval(10000);
     this.subscription = source.subscribe(val => {
       this.ubicacion_quimico();
     });
  }

  cargar_direccion(){
    this._ps.direccion_get(this.token).subscribe((res:any)=>{
      if (res.ubicacion == null) {
        this.pedido = false
      }else{
        this.latitude =parseFloat(res.ubicacion.latitud);
        this.longitude =parseFloat(res.ubicacion.longitud);
        this.pedido = true;
      }



    },err=>{
      console.log(err);

    })
  }


}
