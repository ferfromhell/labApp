import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.page.html',
  styleUrls: ['./slideshow.page.scss'],
})
export class SlideshowPage implements OnInit {

  constructor(private storage:Storage,private router: Router) { }

  ngOnInit() {
  }

  async finalizar(){
    await this.storage.set('slideshow','true');
    this.router.navigate(['/login'])
  }

}
