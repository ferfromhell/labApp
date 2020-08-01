import { Component, OnInit } from '@angular/core';
declare var google;
interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}
@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.page.html',
  styleUrls: ['./sucursales.page.scss'],
})
export class SucursalesPage implements OnInit {
  public map=null;
  markers: Marker[] = [
  {
    position: {
      lat: 19.051124,
      lng: -98.231325,
    },
    title: 'Matriz'
  },
  {
    position: {
      lat: 19.017912,
      lng: -98.192039,
    },
    title: 'Los Pilares'
  },
  {
    position: {
      lat: 19.060493,
      lng: -98.196529,
    },
    title: 'Santa María'
  },
  {
    position: {
      lat: 19.149935,
      lng: -98.409310,
    },
    title: 'Huejotzingo'
  },
  {
    position: {
      lat: 17.805318,
      lng: -97.783239,
    },
    title: 'Huajuapan de León'
  },
  {
    position: {
      lat: 19.034135,
      lng:  -98.189456,
    },
    title: 'TM 18 SUR'
  }

];


  constructor() { }

  ngOnInit() {
    this.loadMap();
  }
  loadMap() {
  // create a new map by passing HTMLElement
  const mapEle: HTMLElement = document.getElementById('map');
  // create LatLng object

  const myLatLng = {lat: 19.051124, lng: -98.231325};
  // create map
  this.map = new google.maps.Map(mapEle, {
    center: myLatLng,
    zoom: 10
  });

  google.maps.event.addListenerOnce(this.map, 'idle', () => {

    mapEle.classList.add('show-map');
    this.renderMarkers();

  });
}
renderMarkers() {
  this.markers.forEach(marker => {
    this.addMarker(marker);
  });
}

addMarker(marker: Marker) {
  return new google.maps.Marker({
    position: marker.position,
    map: this.map,
    title: marker.title,
    label:{
      text:marker.title,
      color:"#3880ff",
      paddingBottom:"20rem"
    },
  });
}

}
