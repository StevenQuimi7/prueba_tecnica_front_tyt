import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CargoModel } from '../model/cargo.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CargoService {

  constructor(private httpClient:HttpClient) { }
  getCargos(): Observable<CargoModel[]> {
    return this.httpClient
    .get<{text:CargoModel[]}>('http://127.0.0.1:8000/api/cargos/listarCargos')
    .pipe(
      map((response)=>response.text)
    );
  }
}
