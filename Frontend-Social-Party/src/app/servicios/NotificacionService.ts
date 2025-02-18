import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotificacionDTO } from '../modelos/NotificacionDTO';
import { ComunService } from './comun.service';

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient, private comunService: ComunService) {}

    getNotificacionesNoLeidas(userId: number): Observable<NotificacionDTO[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<NotificacionDTO[]>(`${this.baseUrl}/notificaciones/no-leidas/${userId}`, options);
    }

    marcarComoLeida(notificacionId: number): Observable<any> {
        const options = this.comunService.autorizarPeticion();
        return this.http.put(`${this.baseUrl}/notificaciones/marcarLeida/${notificacionId}`, {}, options);
    }
}
