import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun.service";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Evento} from "../modelos/Evento";
import {Entrada} from "../modelos/Entrada";

@Injectable({
    providedIn: 'root'
})
export class EntradaService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private comunService: ComunService) {
    }

    comprarEntrada(idEvento: number, idEmpresa: number, idCliente: number): Observable<Entrada> {
        const options = this.comunService.autorizarPeticion();
        return this.http.post<Entrada>(`${this.apiUrl}/cliente/comprar/entrada/${idEvento}/${idEmpresa}/${idCliente}`,{}, options);
    }

    verEntradas(idCliente: number): Observable<Entrada[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Entrada[]>(`${this.apiUrl}/cliente/ver/entradas/${idCliente}`, options);
    }

    canjear(codigoEntrada: number): Observable<Entrada> {
        const options = this.comunService.autorizarPeticion();
        return this.http.post<Entrada>(`${this.apiUrl}/empresa/canjear/entrada/${codigoEntrada}`,{}, options);
    }
}
