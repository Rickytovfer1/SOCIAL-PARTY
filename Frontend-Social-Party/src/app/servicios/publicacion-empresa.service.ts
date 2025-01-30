import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MostrarPublicacionDTO } from './publicacion.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ComunService } from './comun.service';

@Injectable({
    providedIn: 'root'
})
export class PublicacionEmpresaService {
    private baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private comunService: ComunService
    ) {}


   listarPublicacionesEmpresa(idUsuario: number): Observable<MostrarPublicacionDTO[]> {
   const options = this.comunService.autorizarPeticion();
     return this.http.get<MostrarPublicacionDTO[]>(
      `${this.baseUrl}/empresa/publicaciones-empresa/${idUsuario}`,
     options
    );
   }
}
