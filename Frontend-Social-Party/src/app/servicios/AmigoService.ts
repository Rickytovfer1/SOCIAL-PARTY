import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ComunService } from './comun.service';
import { ClienteDTO } from '../modelos/ClienteDTO';

@Injectable({
    providedIn: 'root'
})
export class AmigoService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private comunService: ComunService) { }

    getAmigos(idUsuario: number): Observable<ClienteDTO[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<ClienteDTO[]>(`${this.apiUrl}/cliente/amigos/${idUsuario}`, options);
    }
}
