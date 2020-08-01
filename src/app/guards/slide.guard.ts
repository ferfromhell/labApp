import { Injectable } from '@angular/core';
import { CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class SlideGuard implements CanLoad {
  constructor(private storage:Storage,private router: Router){

  }
async canLoad(): Promise<boolean> {
      var value;
    await this.storage.get('slideshow').then((val) => {
          value = val;
      });

    if(value == null){
      return true;
    }else{
      this.router.navigate(['/login'])
    }

  }

}
