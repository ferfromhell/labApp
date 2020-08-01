import { Injectable } from '@angular/core';
import { LoadingController,ToastController,AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ComponentesService {

  constructor(public loadingController: LoadingController,public toastController: ToastController,public alertController: AlertController,
  ) {

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

    async toast(message="",header="",duration = 2200,) {
       const toast = await this.toastController.create({
         header: header,
         position:"bottom",
         message: message,
         duration: duration
       });
       toast.present();
     }

  async presentAlert(message) {
   const alert = await this.alertController.create({
     cssClass: 'my-custom-class',
     message: message ,
     buttons: ['OK']
   });

   await alert.present();
 }


}
