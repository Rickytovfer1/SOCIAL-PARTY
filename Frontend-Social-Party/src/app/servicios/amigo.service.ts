import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ComunService } from './comun.service';
import { Cliente } from '../modelos/Cliente';

@Injectable({
    providedIn: 'root'
})
export class AmigoService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private comunService: ComunService) { }

    getAmigos(idUsuario: number): Observable<Cliente[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Cliente[]>(`${this.apiUrl}/cliente/amigos/${idUsuario}`, options);
    }

    eliminarAmigo(idUsuario: number, idAmigo: number): Observable<any> {
        const options = this.comunService.autorizarPeticion();
        return this.http.post(`${this.apiUrl}/cliente/amigo/eliminar/${idUsuario}/${idAmigo}`, {}, options);
    }

}
