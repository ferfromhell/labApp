import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ModalController } from '@ionic/angular';
import { DireccionService } from "../../services/direccion.service";
import { LoadingController,ToastController } from '@ionic/angular';
import { DireccionModel } from "../../models/direccion";
import { Storage } from "@ionic/storage";
import { ComponentesService } from "../../services/componentes.service";

declare var google;


@Component({
  selector: 'app-direccion-modal',
  templateUrl: './direccion-modal.page.html',
  styleUrls: ['./direccion-modal.page.scss'],
})
export class DireccionModalPage implements OnInit {

  @ViewChild('map',  {static: false}) mapElement: ElementRef;
  map: any;
  address:string;
  lat:any;
  long:any;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  confirm:any='No';
  direcion_com = false;
  direccion:DireccionModel;
  identity:any;
  token:any;

  constructor(public modalController: ModalController,private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,private storages:Storage,private _ds:DireccionService, public loadingController: LoadingController,public toastController: ToastController,private _cs:ComponentesService) {
      this.direccion = new DireccionModel('','','','','','','',0,0);
      this.autocomplete = { input: '' };
      this.autocompleteItems = [];
    }
    async  ngOnInit() {
     await  this.identity_get();
     await  this.token_get();
     this.loadMap();
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
   async toast(message,header) {
     const toast = await this.toastController.create({
       header: header,
       position: 'bottom',
       message: message,
       duration: 2200
     });
     toast.present();
   }

    dismiss() {
      this.modalController.dismiss(this.direcion_com);
    }

    loadMap(search = false) {
      console.log(this.long);
      console.log(this.lat);


      this.geolocation.getCurrentPosition().then((resp) => {
        if (search==false) {
          this.lat = resp.coords.latitude;
          this.long = resp.coords.longitude;
        }

        let latLng = new google.maps.LatLng(this.lat, this.long);

        let mapOptions = {
          center: latLng,
          zoom: 18,
          disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

          var marker = new google.maps.Marker({
            position:{
              lat: this.lat,
              lng: this.long,
            },
            map: this.map,
            title: 'mi ubicacion',
            animation: google.maps.Animation.DROP,
            draggable: true
          });

        google.maps.event.addListener(marker, 'dragend',  (evt)=> {
          this.lat = this.map.center.lat();
          this.long = this.map.center.lng();
          console.log(this.lat);
          console.log(this.long);

        });

        // // centers the map on markers coords
         this.map.setCenter(marker.position);
        //
      }).catch((error) => {
        console.log('Error getting location', error);
      });

  }

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords "+lattitude+" "+longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if(value.length>0)
          responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value+", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) =>{
        this.address = "Address Not Available!";
      });
  }
  //FUNCION DEL BOTON INFERIOR PARA QUE NOS DIGA LAS COORDENADAS DEL LUGAR EN EL QUE POSICIONAMOS EL PIN.
ShowCords(){
  this.confirm = 'Si'
}

//AUTOCOMPLETE, SIMPLEMENTE ACTUALIZAMOS LA LISTA CON CADA EVENTO DE ION CHANGE EN LA VISTA.
UpdateSearchResults(){
  if (this.autocomplete.input == '') {
    this.autocompleteItems = [];
    return;
  }
  this.GoogleAutocomplete = new google.maps.places.PlacesService(this.map);

  this.GoogleAutocomplete.textSearch({ input: this.autocomplete.input },
  (predictions, status) => {
    this.autocompleteItems = [];
    this.zone.run(() => {
      if (predictions!=null) {
        predictions.forEach((prediction) => {
          console.log(prediction);
          this.autocompleteItems.push(prediction);
        });
      }

    });
  });
}

//FUNCION QUE LLAMAMOS DESDE EL ITEM DE LA LISTA.
SelectSearchResult(item) {
   this.lat = item.geometry.location.lat()
   this.long = item.geometry.location.lng()
   this.confirm = 'coordenadas';
   this.ClearAutocomplete();
   this.address = item.formatted_address;
  this.loadMap(true);
  this.toast('Coloca el marcador en la entrada de tu edificio','Hola '+this.identity.nombres)
}


//LLAMAMOS A ESTA FUNCION PARA LIMPIAR LA LISTA CUANDO PULSAMOS IONCLEAR.
ClearAutocomplete(){
  this.autocompleteItems = []
  this.autocomplete.input = ''
}

//EJEMPLO PARA IR A UN LUGAR DESDE UN LINK EXTERNO, ABRIR GOOGLE MAPS PARA DIRECCIONES.
GoTo(){
  return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id='+this.placeid;
}

registro_direccion(form){

  if(this.direccion.interior==""){
    this.direccion.interior = "0";
  }
  this.direccion.latitud = this.lat;
  this.direccion.longitud = this.long;

  this.showLoader()
  this._ds.new_direccion(this.token,this.direccion).subscribe(res=>{
    this.hideLoader();
    this.toast('Se ha agregado la nueva dirección','Registro con Exito');
    form.reset();
    this.direcion_com=true;
    this.modalController.dismiss(this.direcion_com);
  },err=>{
    console.log(err);

    this.hideLoader();
    this.toast('Verifica que tengas internet y/o un token valido','Algo ha ocurrido')
  })
}





}
