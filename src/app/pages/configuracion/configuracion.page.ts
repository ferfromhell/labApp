import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { ModalController } from '@ionic/angular';
import { UpdateUserPage } from '../update-user/update-user.page';
import { ImagePicker,ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { UsuarioService } from "../../services/usuario.service";
import { ComponentesService } from "../../services/componentes.service";
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  public contrasena=false;
  public nueva:string;
  public actual:string;
  public repetir:string;
  public identity:any={};
  public token;
  public result:any='assets/3609911.jpg';
  constructor(public modalController: ModalController, private storages:Storage,private imagePicker: ImagePicker,private _us:UsuarioService,private _cs:ComponentesService) {

   }

  async  ngOnInit() {
       await  this.identity_get();
       await  this.token_get();
       console.log(this.identity);
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
     this.result = this.identity.imagen_perfil;
     }
  async update() {
      const modal = await this.modalController.create({
        component: UpdateUserPage,
        cssClass: 'my-custom-class'
      });
      return await modal.present();
    }
  image() {
      let options: ImagePickerOptions ={
        quality:60,
        outputType:1,
        maximumImagesCount:1,
      }
      this.imagePicker.getPictures(options).then((results) => {
        for (var i = 0; i < results.length; i++) {
          console.log(results[i]);

          this.result = 'data:image/jpeg;base64,' + results[i];
          this.image_save();
        }
      }, (err) => {

       });
    }
  image_save(){

      if (this.result == undefined || this.result == 'data:image/jpeg;base64,K' || this.result == 'data:image/jpeg;base64,O') {
        this.result = "assets/3609911.jpg";
        return;
      }

      this._cs.showLoader();
      let data={
        file:this.result
      }

      this._us.image(this.token,data).subscribe((res:any)=>{
        this.storages.set('identity',res.user);
        this.identity_get();
        this._cs.hideLoader();
      },err=>{
        this._cs.hideLoader();
      });
    }
  cambiar(){
      if (this.contrasena) {
        this.contrasena = false;
      }else{
        this.contrasena = true;
      }
    }
  password_update(){
      if(this.nueva == this.repetir){
        if (this.actual == undefined) {

          this._cs.toast('Ingresa la contraseña actual','Atención');
          return
        }
        if (this.actual == this.nueva) {
          this._cs.toast('Tu nueva contraseña debe ser diferente a la actual','Atención');
          return
        }
        this._cs.showLoader();
        const data={
          actual:this.actual,
          nueva:this.nueva
        }
        this._us.update_password(this.token,data).subscribe((res:any)=>{
          this.contrasena = false;
          this.actual = null
          this.nueva = null
          this.repetir = null
          this._cs.hideLoader();
          this._cs.toast('Tu cambio de contraseña se modifico con exito','Hola');

        },err=>{
            this._cs.toast('Hubo algun problema intentalo más tarde','Ups...');
        })
        console.log(data);

      }else{
        this._cs.toast('La contraseña actual no coincide','Atención');
      }
    }
}
