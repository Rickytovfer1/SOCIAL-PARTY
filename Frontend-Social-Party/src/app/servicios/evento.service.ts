import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ComunService} from "./comun.service";
import {Evento} from "../modelos/Evento";
import {environment} from "../../environments/environment";
import {Empresa} from "../modelos/Empresa";
import {Cliente} from "../modelos/Cliente";

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
    verEvento(idEvento: number): Observable<Evento> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Evento>(`${this.apiUrl}/cliente/evento/ver/${idEvento}`, options);
    }

    verEmpresa(idEmpresa: number | undefined): Observable<Empresa> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Empresa>(`${this.apiUrl}/cliente/ver/${idEmpresa}`, options);
    }

    verPersonasEvento(idEvento: number): Observable<Cliente[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Cliente[]>(`${this.apiUrl}/cliente/evento/ver/personas/${idEvento}`, options)
    }

}
