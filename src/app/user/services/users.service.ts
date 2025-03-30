import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient:HttpClient) { }

  getUsers(filtro: { idDepartamento?: number; idCargo?: number; perPage?: number; page?: number }): Observable<any> {
    return this.httpClient.post('http://127.0.0.1:8000/api/usuarios/listarUsuarios', filtro);
  }
  
  storeUser(user:UserModel):Observable<any>{
    return this.httpClient.post<any>('http://127.0.0.1:8000/api/usuarios/crearUsuario',user);
  }

  updateUser(user:UserModel):Observable<any>{
    return this.httpClient.post<any>('http://127.0.0.1:8000/api/usuarios/editarUsuario',user);
  }

  deleteUser(user:any):Observable<any>{
    return this.httpClient.post<any>('http://127.0.0.1:8000/api/usuarios/eliminarUsuario',user);
  }

}
