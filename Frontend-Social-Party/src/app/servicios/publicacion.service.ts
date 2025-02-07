import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { ComunService } from "./comun.service";

export interface MostrarPublicacionDTO {
    id: number;
    texto: string;
    titulo: string;
    hora: string;
    fecha: string;
    foto: string;
    direccion: string;
    idUsuario: number;
    perfilEmpresaId?: number;
}

@Injectable({
    providedIn: 'root'
})
export class PublicacionService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient, private comunService: ComunService) { }

    listarPublicaciones(): Observable<MostrarPublicacionDTO[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<MostrarPublicacionDTO[]>(`${this.baseUrl}/cliente/ver/publicaciones`, options)
            .pipe(
                catchError(error => {
                    console.error('Error fetching publicaciones:', error);
                    return throwError(() => new Error('Error fetching publicaciones'));
                })
            );
    }

    crearPublicacionCliente(dto: any, foto: File): Observable<void> {
        const formData: FormData = new FormData();
        formData.append('texto', dto.texto);
        formData.append('foto', foto);
        formData.append('idUsuario', dto.idUsuario.toString());

        const options = this.comunService.autorizarPeticionFormData();
        return this.http.post<void>(`${this.baseUrl}/cliente/crear/publicacion`, formData, options)
            .pipe(
                catchError(error => {
                    console.error('Error creating publicacion:', error);
                    return throwError(() => new Error('Error creating publicacion'));
                })
            );
    }

    listarFeed(idUsuario: number | undefined): Observable<MostrarPublicacionDTO[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<MostrarPublicacionDTO[]>(`${this.baseUrl}/feed/${idUsuario}`, options)
            .pipe(
                catchError(error => {
                    console.error('Error fetching feed:', error);
                    return throwError(() => new Error('Error fetching feed'));
                })
            );
    }

    crearPublicacionEmpresa(dto: any, foto: File): Observable<void> {
        const formData: FormData = new FormData();
        formData.append('texto', dto.texto);
        formData.append('titulo', dto.titulo);
        formData.append('direccion', dto.direccion);
        formData.append('foto', foto);
        formData.append('idUsuario', dto.idUsuario.toString());

        const options = this.comunService.autorizarPeticionFormData();
        return this.http.post<void>(`${this.baseUrl}/empresa/crear/publicacion`, formData, options)
            .pipe(
                catchError(error => {
                    console.error('Error creating publicacion:', error);
                    return throwError(() => new Error('Error creating publicacion'));
                })
            );
    }
    getPublicacion(id: number): Observable<MostrarPublicacionDTO> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<MostrarPublicacionDTO>(`${environment.apiUrl}/publicacion/${id}`, options);
    }

}
