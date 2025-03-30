export class UserModel {
  idUser? : number|any;
  usuario : string;
  primerNombre : string;
  primerApellido : string;
  segundoNombre : string;
  segundoApellido : string;
  idDepartamento : number;
  idCargo : number;
  email : string;
  nombreCargo?: string;
  nombreDepartamento?: string;
  constructor(
    usuario : string,
    primerNombre : string,
    primerApellido : string,
    segundoNombre : string,
    segundoApellido : string,
    idDepartamento : number,
    idCargo : number,
    email : string,
    idUser? : number,
    nombreCargo? : string,
    nombreDepartamento? : string
  ){
    
      this.usuario = usuario,
      this.primerNombre = primerNombre,
      this.primerApellido = primerApellido,
      this.segundoNombre = segundoNombre,
      this.segundoApellido = segundoApellido,
      this.idDepartamento = idDepartamento,
      this.idCargo = idCargo,
      this.email = email,
      this.idUser = idUser
      this.nombreCargo = nombreCargo
      this.nombreDepartamento = nombreDepartamento
  }
  }
  