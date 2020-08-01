import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from "./global";


@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  public url:string;

  constructor(private _http:HttpClient) {
  this.url = Global.url;
 }

  get_estudios(token){
    var headers = new HttpHeaders().set('Authorization',token);
    return this._http.get(this.url+'get_carrito',{headers:headers});
  }

  delte_carrito_item(token,id){
    var headers = new HttpHeaders().set('Authorization',token);
    return this._http.get(this.url+'delete_carrito/'+id,{headers:headers});
  }




}
