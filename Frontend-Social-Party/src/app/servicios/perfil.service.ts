import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Perfil } from "../modelos/Perfil";
import { ComunService } from "./comun.service";
import { environment } from "../../environments/environment";
import { PerfilEmpresa } from "../modelos/PerfilEmpresa";
import { ActualizarCliente } from "../modelos/ActualizarCliente";
import { TipoUsuarioDTO } from "../modelos/TipoUsuarioDTO";
import {Empresa} from "../modelos/Empresa";

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

    getPerfilEmpresaUsuario(idUsuario: number): Observable<TipoUsuarioDTO> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<TipoUsuarioDTO>(`${this.apiUrl}/usuario/tipo/${idUsuario}`, options);
    }

    actualizarPerfil(actualizarCliente: FormData): Observable<ActualizarCliente> {
        const options = this.comunService.autorizarPeticionFormData();
        return this.http.put<ActualizarCliente>(`${this.apiUrl}/cliente/actualizar`, actualizarCliente, options);
    }

    updatePerfilEmpresa(perfilEmpresa: FormData): Observable<PerfilEmpresa> {
        const options = this.comunService.autorizarPeticionFormData();
        return this.http.put<PerfilEmpresa>(
            `${this.apiUrl}/empresa/actualizar`,
            perfilEmpresa,
            options
        );
    }

}
