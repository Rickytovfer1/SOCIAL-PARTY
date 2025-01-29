import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {RegistroEmpresa} from "../modelos/RegistroEmpresa";

@Injectable({
  providedIn: 'root'
})
export class RegistroEmpresaService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  registrar(registro: RegistroEmpresa): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/autorizacion/registro/empresa`,registro) ;
  }
}
