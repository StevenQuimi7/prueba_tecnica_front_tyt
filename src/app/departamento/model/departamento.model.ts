export class DepartamentoModel {
  idDepartamento?: number | any;
  nombre: string;
  constructor(idDepartamento: string, nombre: string) {
    (this.idDepartamento = idDepartamento), (this.nombre = nombre);
  }
}
