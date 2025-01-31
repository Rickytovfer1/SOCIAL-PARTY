import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { ComunService } from "./comun.service";
import { EmpresaDTO } from "../modelos/EmpresaDTO";

@Injectable({
    providedIn: 'root'
})
export class EmpresaService {
    private baseUrl = environment.apiUrl;
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private comunService: ComunService) { }

    listarEmpresas(): Observable<EmpresaDTO[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<EmpresaDTO[]>(`${this.baseUrl}/cliente/ver/empresas`, options)
            .pipe(
                catchError(error => {
                    console.error('Error fetching empresas:', error);
                    return throwError(() => new Error('Error fetching empresas'));
                })
            );
    }

    getPerfilEmpresa(idUsuario: number): Observable<EmpresaDTO> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<EmpresaDTO>(`${this.apiUrl}/empresa/perfil/${idUsuario}`, options);
    }

    getPerfilEmpresaPorCorreo(correo: string): Observable<EmpresaDTO> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<EmpresaDTO>(`${this.apiUrl}/empresa/ver/perfil/${correo}`, options);
    }

    actualizarPerfilEmpresa(empresaDTO: EmpresaDTO): Observable<EmpresaDTO> {
        const options = this.comunService.autorizarPeticion();
        console.log('Sending PUT request to actualizarPerfilEmpresa with:', empresaDTO);
        return this.http.put<EmpresaDTO>(`${this.apiUrl}/empresa/actualizar`, empresaDTO, options)
            .pipe(
                catchError(error => {
                    console.error('Error al actualizar la empresa:', error);
                    return throwError(() => new Error('Error al actualizar la empresa'));
                })
            );
    }

}
