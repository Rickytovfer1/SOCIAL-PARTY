import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Evento} from "../modelos/Evento";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun.service";
import {EmpresaDTO} from "../modelos/EmpresaDTO";
import {ClienteDTO} from "../modelos/ClienteDTO";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private apiUrl = environment.apiUrl;


    constructor(private http: HttpClient, private comunService: ComunService) {
    }

    verClientes(): Observable<ClienteDTO[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<ClienteDTO[]>(`${this.apiUrl}/admin/listar/clientes`, options);
    }

    verEmpresas(): Observable<EmpresaDTO[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<EmpresaDTO[]>(`${this.apiUrl}/admin/listar/empresas`, options);
    }
}
