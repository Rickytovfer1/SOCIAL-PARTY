import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { ComunService } from "./comun.service";
import {CrearPublicacionCliente} from "../modelos/CrearPublicacionCliente";
import {MostrarPublicacion} from "../modelos/MostrarPublicacion";
import {CrearPublicacionEmpresa} from "../modelos/CrearPublicacionEmpresa";

@Injectable({
    providedIn: 'root'
})
export class PublicacionService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient, private comunService: ComunService) { }

    listarPublicaciones(): Observable<MostrarPublicacion[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<MostrarPublicacion[]>(`${this.baseUrl}/cliente/ver/publicaciones`, options)
            .pipe(
                catchError(error => {
                    console.error('Error fetching publicaciones:', error);
                    return throwError(() => new Error('Error fetching publicaciones'));
                })
            );
    }

    crearPublicacionCliente(publicacion: CrearPublicacionCliente): Observable<CrearPublicacionCliente> {
        const formData = new FormData();
        formData.append('nombre', publicacion.nombre ?? '');
        formData.append('apellidos', publicacion.apellidos ?? '');
        formData.append('texto', publicacion.texto ?? '');
        formData.append('lugar', publicacion.lugar ?? '');
        formData.append('idUsuario', publicacion.idUsuario ? publicacion.idUsuario.toString() : '');

        if (publicacion.foto) {
            formData.append('foto', publicacion.foto);
        }

        const options = this.comunService.autorizarPeticionFormData();
        return this.http.post<CrearPublicacionCliente>(`${this.baseUrl}/cliente/crear/publicacion`, formData, options);
    }

    listarFeed(idUsuario: number | undefined): Observable<MostrarPublicacion[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<MostrarPublicacion[]>(`${this.baseUrl}/feed/${idUsuario}`, options)
            .pipe(
                catchError(error => {
                    console.error('Error fetching feed:', error);
                    return throwError(() => new Error('Error fetching feed'));
                })
            );
    }

    crearPublicacionEmpresa(publicacion: CrearPublicacionEmpresa): Observable<CrearPublicacionEmpresa> {
        const formData = new FormData();
        formData.append('nombre', publicacion.nombre ?? '');
        formData.append('texto', publicacion.texto ?? '');
        formData.append('lugar', publicacion.lugar ?? '');
        formData.append('idUsuario', publicacion.idUsuario ? publicacion.idUsuario.toString() : '');

        if (publicacion.foto) {
            formData.append('foto', publicacion.foto);
        }

        const options = this.comunService.autorizarPeticionFormData();
        return this.http.post<CrearPublicacionEmpresa>(`${this.baseUrl}/empresa/crear/publicacion`, formData, options);
    }

    getPublicacion(id: number): Observable<MostrarPublicacion> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<MostrarPublicacion>(`${environment.apiUrl}/publicacion/${id}`, options);
    }

    listarPublicacionesEmpresa(idUsuario: number): Observable<MostrarPublicacion[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<MostrarPublicacion[]>(
            `${this.baseUrl}/empresa/publicaciones-empresa/${idUsuario}`,
            options
        );
    }

}
