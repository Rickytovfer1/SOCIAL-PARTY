import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { ComunService } from "./comun.service";

export interface EmpresaDTO {
    id: number;
    nombre: string;
    direccion: string;
    cp: string;
    nif: string;
    telefono: string;
    valoracionMinima: number;
    edadMinimsa: number;
    eventos: number[];
    idUsuario: number;
}

@Injectable({
    providedIn: 'root'
})
export class EmpresaService {
    private baseUrl = environment.apiUrl;

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
}
