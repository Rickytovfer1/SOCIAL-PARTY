import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Perfil} from "../modelos/Perfil";
import {ComunService} from "./comun.service";
import {environment} from "../../environments/environment";
import {PerfilEmpresa} from "../modelos/PerfilEmpresa";

@Injectable({
  providedIn: 'root'
})
export class PerfilServicio {

    private apiUrl = environment.apiUrl;


    constructor(private http: HttpClient, private comunService: ComunService) { }

    getPerfil(idUsuario: number | undefined): Observable<Perfil> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Perfil>(`${this.apiUrl}/cliente/ver/perfil/${idUsuario}`, options);
    }

    getPerfilEmpresa(idUsuario: number): Observable<PerfilEmpresa> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<PerfilEmpresa>(`${this.apiUrl}/empresa/perfil/${idUsuario}`, options);
    }

}
