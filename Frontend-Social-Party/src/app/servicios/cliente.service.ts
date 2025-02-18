import { Injectable } from '@angular/core';
import {RegistroCliente} from "../modelos/RegistroCliente";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Perfil} from "../modelos/Perfil";
import {Cliente} from "../modelos/Cliente";
import {ComunService} from "./comun.service";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private comunService: ComunService) { }

    actualizar(registro: RegistroCliente): Observable<any>{
        return this.http.post<any>(`${this.apiUrl}/autorizacion/registro/cliente`,registro) ;
    }

    getCliente(idUsuario: number | undefined): Observable<Cliente> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Cliente>(`${this.apiUrl}/cliente/ver/perfil/${idUsuario}`, options);
    }

}
