import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from "./global";


@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  public url:string;

  constructor(private _http:HttpClient) {
  this.url = Global.url;
 }

 pedido(token,data){
   var headers = new HttpHeaders().set('Authorization',token);
   return this._http.post(this.url+'g_pedido',data,{headers:headers});
 }
 ver_pedidos(token){
   var headers = new HttpHeaders().set('Authorization',token);
   return this._http.get(this.url+'ver_pedido',{headers:headers});
 }
 ver_anteriores(token){
   var headers = new HttpHeaders().set('Authorization',token);
   return this._http.get(this.url+'ver_anteriores',{headers:headers});

 }
 coment(token,data){
   var headers = new HttpHeaders().set('Authorization',token);
   return this._http.post(this.url+'coment',data,{headers:headers});
 }

 cantidad(token){
   var headers = new HttpHeaders().set('Authorization',token);
   return this._http.get(this.url+'count_p',{headers:headers});
 }

 ubicacion(token){
   var headers = new HttpHeaders().set('Authorization',token);
   return this._http.get(this.url+'ubicacion',{headers:headers});
 }

 direccion_get(token){
   var headers = new HttpHeaders().set('Authorization',token);
   return this._http.get(this.url+'direccion_get',{headers:headers});
 }



}
