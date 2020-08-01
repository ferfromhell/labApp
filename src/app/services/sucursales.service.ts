import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from "./global";

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {
  public url:string;

  constructor(private _http:HttpClient) {
    this.url = Global.url;
   }
   ver(){
    return this._http.get(this.url+'sucursal/ver');
   }
}
