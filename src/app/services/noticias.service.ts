import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from "./global";

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {
  public url:string;

  constructor(private _http:HttpClient) {
   this.url = Global.url;
  }

  ServiceHttp(token:string,query:string,peticion:string='get',data=null){
    let headers = new HttpHeaders()
                 .set('Authorization',token);
    if (peticion=='get') {
      return this._http.get(this.url+query,{headers:headers});
    }else if (peticion=='post') {
      return this._http.post(this.url+query,data,{headers:headers});
    }
  }

  get_noticias(token:string){
    console.log('service');
    console.log(token);

      return this.ServiceHttp(token,'noticias/ver');
  }

}
