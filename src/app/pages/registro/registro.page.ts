import { Component, OnInit } from '@angular/core';
import { NavController,ToastController  } from "@ionic/angular";
import { UsuarioService } from "../../services/usuario.service";
import { UserModel } from "../../models/user";
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  public user:UserModel;
  public loading=false;

  constructor(private _us:UsuarioService,private navCtrl:NavController,
              public toastController: ToastController,
              public loadingController: LoadingController,private router: Router) {
    this.user = new UserModel('','','','','','','','');
  }

  ngOnInit() {
  }
  async toast(message,header) {
    const toast = await this.toastController.create({
      header: header,
      position: 'top',
      message: message,
      duration: 2200
    });
    toast.present();
  }

  registro(form){
    this.loading = true;
    this._us.register_user(this.user).subscribe(
      response=>{
        this.loading = false;
      var res:any = response;
      form.reset();
      this.router.navigate(['/login'])
      let message:string ="Bienvenido "+res.user.nombres+' '+res.user.apellido_paterno+' '+res.user.apellido_materno;
      let header:string ="Registro Exitoso"
      this.toast(message,header);
    },err=>{
        this.loading = false;
        let message:string ="Verifica que los datos sean correctos o intentalo mas tarde";
        let header:string ="Error al registrar"
        this.toast(message,header);
    });
  }

}
