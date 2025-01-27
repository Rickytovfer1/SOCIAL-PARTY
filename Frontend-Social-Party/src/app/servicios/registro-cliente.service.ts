import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {RegistroCliente} from "../modelos/RegistroCliente";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RegistroClienteService {

  private apiUrl = environment.apiUrl;

  private authState = new BehaviorSubject<boolean>(!!sessionStorage.getItem('authToken'));
  authState$ = this.authState.asObservable();

  constructor(private http: HttpClient) { }

  registrar(registro: RegistroCliente): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/autorizacion/registro/cliente`,registro) ;
  }
}
