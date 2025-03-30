import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepartamentoModel } from '../model/departamento.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DepartamentoService {
  constructor(private httpClient: HttpClient) {}

  getDepartamentos(): Observable<DepartamentoModel[]> {
    return this.httpClient
      .get<{ text: DepartamentoModel[] }>(
        'http://127.0.0.1:8000/api/departamentos/listarDepartamentos'
      )
      .pipe(
        map((response) => response.text)
      );
  }
}
