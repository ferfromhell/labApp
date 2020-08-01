import { Injectable } from '@angular/core';
import { CanActivate,CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from "../services/usuario.service";

@Injectable({
  providedIn: 'root'
})
export class UsuariosGuard implements CanLoad {

 constructor(private _us:UsuarioService){

 }

   canLoad(): Promise<boolean>  {
    return this._us.verifiToken();
  }

}
