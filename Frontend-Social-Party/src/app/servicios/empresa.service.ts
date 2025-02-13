import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { ComunService } from "./comun.service";
import { Empresa } from "../modelos/Empresa";
import {Evento} from "../modelos/Evento";

@Injectable({
    providedIn: 'root'
})
export class EmpresaService {
    private baseUrl = environment.apiUrl;
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private comunService: ComunService) { }

    listarEmpresas(): Observable<Empresa[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Empresa[]>(`${this.baseUrl}/cliente/ver/empresas`, options)
            .pipe(
                catchError(error => {
                    console.error('Error fetching empresas:', error);
                    return throwError(() => new Error('Error fetching empresas'));
                })
            );
    }

    getPerfilEmpresa(idUsuario: number): Observable<Empresa> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Empresa>(`${this.apiUrl}/empresa/perfil/${idUsuario}`, options);
    }

    getPerfilEmpresaPorCorreo(correo: string): Observable<Empresa> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Empresa>(`${this.apiUrl}/empresa/ver/perfil/${correo}`, options);
    }

    actualizarPerfilEmpresa(empresaDTO: Empresa): Observable<Empresa> {
        const options = this.comunService.autorizarPeticion();
        console.log('Sending PUT request to actualizarPerfilEmpresa with:', empresaDTO);
        return this.http.put<Empresa>(`${this.apiUrl}/empresa/actualizar`, empresaDTO, options)
            .pipe(
                catchError(error => {
                    console.error('Error al actualizar la empresa:', error);
                    return throwError(() => new Error('Error al actualizar la empresa'));
                })
            );
    }

    getEventoHoy(idEmpresa: number): Observable<Evento> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Evento>(`${this.apiUrl}/empresa/ver/evento/hoy/${idEmpresa}`, options);
    }

}
