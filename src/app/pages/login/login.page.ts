import { Component, OnInit,ViewChild } from '@angular/core';
import { NavController,ToastController,LoadingController } from "@ionic/angular";
import { UsuarioService } from "../../services/usuario.service";
import { UserModel } from "../../models/user";
import { Storage } from "@ionic/storage";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public user:UserModel;
  public status:string;
  public loading=false;
  constructor(private _us:UsuarioService,private navCtrl:NavController,
              public toastController: ToastController,private storage:Storage,  public loadingController: LoadingController) {
    this.user = new UserModel('','','','','','','','');
   }
  ngOnInit() {

  }
  async toast(message,header) {
    const toast = await this.toastController.create({
      header: header,
      position: 'top',
      message: message,
      duration: 2150
    });
    toast.present();
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
  login(form){
    this.loading= true;
      this._us.login_service(this.user.correo,this.user.password,false).subscribe(
        response =>{
          var res:any = response;
        if (res && res.id) {
          this.loading=false;
          this.storage.set('identity',res);
          this.getToken(this.user.correo,this.user.password);
          this.toast('Bienvenido Nuevamente '+ res.nombres+' '+res.apellido_paterno+' '+res.apellido_materno ,'Exito');
          this.navCtrl.navigateRoot('tabs/inicio');
          form.reset();

        }else if(res.status=='error') {
          this.loading=false;
          this.storage.clear();
          this.toast('EL correo o la constraseña son incorrectos','¡Algo Ocurrio!');
        }
      },error=>{
        this.loading=false;
        this.storage.clear();
        this.toast('EL correo o la constraseña son incorrectos','¡Algo Ocurrio!');
      }
    );
  }

  getToken(correo,password){
    this._us.login_service(this.user.correo,this.user.password,true).subscribe(
      res=>{
      if (typeof(res)=='string') {
        this._us.save_token(res);
      }else{
        this.storage.clear();
      }
    },error=>{
      this.storage.clear();
    }
  );
  }



}
