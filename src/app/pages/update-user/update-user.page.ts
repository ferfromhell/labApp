import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserModel } from "../../models/user";
import { UsuarioService } from "../../services/usuario.service";
import { ComponentesService } from "../../services/componentes.service";
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';
@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.page.html',
  styleUrls: ['./update-user.page.scss'],
})
export class UpdateUserPage implements OnInit {
  public user:UserModel;
  public identity:any={};
  public token;
  constructor(private router: Router, private _us:UsuarioService, public modalCtrl: ModalController,private storages:Storage, public _sc:ComponentesService) {
      this.user = new UserModel('','','','','','','','');
     }
     async  ngOnInit() {
        await  this.identity_get();
        await  this.token_get();
        this.user.nombre= this.identity.nombres ,
        this.user.app= this.identity.apellido_paterno ,
        this.user.apm=  this.identity.apellido_materno ,
        this.user.correo = this.identity.correo ,
        this.user.telefono=  this.identity.telefono ,
        this.user.genero= this.identity.nombre
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
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  modificacion(form){
    console.log(this.user);

    this._us.update(this.token,this.user).subscribe(response=>{
      var res:any=response;
      this.storages.set('identity',res.user);
      let message="Tus datos se actualizaron de manera correcta";
      let header = "Operación con exito";
      this._sc.toast(message,header)
      this.dismiss();
      this.router.navigate(['/tabs/cuenta']);

    },err=>{
      console.log(err);
    })

  }

}
