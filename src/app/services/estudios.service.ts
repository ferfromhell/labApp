import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from "./global";

@Injectable({
  providedIn: 'root'
})
export class EstudiosService {
  public url:string;

  constructor(private _http:HttpClient) {
    this.url = Global.url;
   }

   get_estudios(token,page){
    let headers = new HttpHeaders().set('Authorization',token);
    return this._http.get(this.url+'get_estudios?page='+page,{headers:headers});
   }
   get_estudio(token,id){
    let headers = new HttpHeaders().set('Authorization',token);
     return this._http.get(this.url+'get_estudio/'+id,{headers:headers})
   }
   search_estudios(token,text){
     let headers = new HttpHeaders().set('Authorization',token);
      return this._http.get(this.url+'search/'+text,{headers:headers})
   }
   // NOTE: Pasar a carrito service
   carrito_add(token,params){
     let headers = new HttpHeaders().set('Authorization',token);
      return this._http.post(this.url+'add_carrito',params,{headers:headers})
   }
   count_stack(token){
     let headers = new HttpHeaders().set('Authorization',token);
      return this._http.get(this.url+'count_carrito',{headers:headers})
   }
   // 20200618092336
   // http://sassdev.dyndns.org/ws/tests.php?client=ael

}
