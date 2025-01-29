import { Injectable } from '@angular/core';
import {RegistroCliente} from "../modelos/RegistroCliente";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }
    actualizar(registro: RegistroCliente): Observable<any>{
        return this.http.post<any>(`${this.apiUrl}/autorizacion/registro/cliente`,registro) ;
    }

}
