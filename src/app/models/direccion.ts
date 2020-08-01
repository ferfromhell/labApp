export class DireccionModel {
  constructor(
    public  direccion:string,
    public  colonia:string,
    public  cp:string,
    public  ciudad:string,
    public  interior:string,
    public  estado:string,
    public exterior:string,
    public latitud:number,
    public longitud:number
  ) {

  }
}
