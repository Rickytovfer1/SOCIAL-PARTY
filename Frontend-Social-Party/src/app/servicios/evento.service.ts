import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PerfilEmpresa} from "../modelos/PerfilEmpresa";
import {ComunService} from "./comun.service";
import {Evento} from "../modelos/Evento";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class EventoService {

    private apiUrl = environment.apiUrl;


    constructor(private http: HttpClient, private comunService: ComunService) {
    }

    getEventos(idEmpresa: number): Observable<Evento[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Evento[]>(`${this.apiUrl}/cliente/ver/evento/${idEmpresa}`, options);
    }
    crearEvento(evento: FormData): Observable<any> {
        const options = this.comunService.autorizarPeticionFormData();
        return this.http.post(`${this.apiUrl}/empresa/crear/evento`, evento, options);
    }
}
