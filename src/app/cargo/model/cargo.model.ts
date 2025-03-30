export class CargoModel {
  idCargo?: number | any;
  nombre: string;
  constructor(idCargo: string, nombre: string) {
    (this.idCargo = idCargo), (this.nombre = nombre);
  }
}
