import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ComunService } from './comun.service';
import { SolicitudDTO } from '../modelos/solicitud.dto';

@Injectable({
    providedIn: 'root'
})
export class SolicitudService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private comunService: ComunService) { }

    getSolicitudes(idUsuario: number): Observable<SolicitudDTO[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<SolicitudDTO[]>(`${this.apiUrl}/cliente/solicitudes?idUsuario=${idUsuario}`, options);
    }

    aceptarSolicitud(idUsuario: number, idUsuario2: number): Observable<any> {
        const options = this.comunService.autorizarPeticion();
        return this.http.post(`${this.apiUrl}/cliente/amigos/aceptar/${idUsuario}/${idUsuario2}`, {}, options);
    }


    eliminarSolicitud(idSolicitud: number): Observable<any> {
        const options = this.comunService.autorizarPeticion();
        const dto = { idSolicitud: idSolicitud };
        return this.http.delete(`${this.apiUrl}/cliente/solicitud/eliminar`, { ...options, body: dto });
    }
}
