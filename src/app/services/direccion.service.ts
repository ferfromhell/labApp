import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from "./global";


@Injectable({
  providedIn: 'root'
})
export class DireccionService {
  public url:string;
  constructor(private _http:HttpClient) {
    this.url = Global.url;
  }

  new_direccion(token,data){
    var headers = new HttpHeaders().set('Authorization',token);
    return this._http.post(this.url+'new_direccion',data,{headers:headers});
  }

  get_direccion(token){
    var headers = new HttpHeaders().set('Authorization',token);
    return this._http.get(this.url+'get_direccion',{headers:headers});
  }
}
