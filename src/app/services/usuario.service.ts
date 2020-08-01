import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { Global } from "./global";
import { NavController } from "@ionic/angular";


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public token:string = null;
  public identity:string;
  public url:string;

  constructor(private _http:HttpClient,private storage:Storage,private navCtrl:NavController) {
    this.url = Global.url;
   }
   ServiveHttp(token:string,query:string,peticion:string='get',data=null){
     let headers = new HttpHeaders()
                  .set('Authorization',token);
     if (peticion=='get') {

     }else if (peticion=='post') {
       return this._http.post(this.url+query,data,{headers:headers});
     }
   }
  // NOTE: Login de usuario
  login_service(correo:string,password:string,token) {
     const data={
       correo,
       password,
       token
     };
    return  this._http.post(this.url + 'login',data);
   }
  // NOTE: Guardar token en caso de un login exitoso
  async save_token(token=null){
    this.token= token;
    await  this.storage.set('token',this.token);
  }
  register_user(data){
   return this._http.post(this.url+'register',data);
  }
  update(token,params){
    let headers = new HttpHeaders().set('Authorization',token);
     return this._http.put(this.url+'update',params,{headers:headers})
  }
  update_password(token,params){
    let headers = new HttpHeaders().set('Authorization',token);
     return this._http.put(this.url+'user/password',params,{headers:headers})
  }
  image(token,params){
    return this.ServiveHttp(token,'upload','post',params);
  }
  async getToken(){
    await this.storage.get('token').then((val) => {
      this.token = val;
    });
  }

 async  verifiToken():Promise<boolean>{
  await  this.getToken();

  if (!this.token) {
    return new Promise<boolean> (resolve=>{
      resolve(true);
    });
  }

  return  new Promise<boolean> (resolve =>{
      let headers = new HttpHeaders().set('Authorization',this.token);
       this._http.get(this.url+'identity',{headers:headers}).subscribe((res:any)=>{
         console.log(res);

         if (res.user == true) {
           this.navCtrl.navigateRoot('/tabs/inicio');
         }else{
           resolve(true);
         }
       })
     })


  }

}
