import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ComunService } from './comun.service';
import { MensajeDTO } from '../modelos/MensajeDTO';

@Injectable({
    providedIn: 'root'
})
export class MensajeService {

    private baseUrl = `${environment.apiUrl}/cliente/mensaje`;

    constructor(
        private http: HttpClient,
        private comunService: ComunService
    ) {}

    verConversacion(idEmisor: number, idReceptor: number): Observable<MensajeDTO[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<MensajeDTO[]>(`${this.baseUrl}/ver/${idEmisor}/${idReceptor}`, options);
    }

    enviarMensaje(mensaje: MensajeDTO): Observable<void> {
        const options = this.comunService.autorizarPeticion();
        return this.http.post<void>(`${this.baseUrl}/enviar`, mensaje, options);
    }
}
