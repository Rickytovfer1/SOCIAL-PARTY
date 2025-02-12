import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Evento} from "../modelos/Evento";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun.service";
import {EmpresaDTO} from "../modelos/EmpresaDTO";
import {ClienteDTO} from "../modelos/ClienteDTO";
import {Perfil} from "../modelos/Perfil";
import {ActualizarCliente} from "../modelos/ActualizarCliente";
import {Usuario} from "../modelos/Usuario";
import {EditarEstrellaDTO} from "../modelos/EditarEstrellaDTO";

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

    getCliente(idCliente: number): Observable<ClienteDTO> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<ClienteDTO>(`${this.apiUrl}/admin/ver/cliente/${idCliente}`, options);
    }

    getClientePerfil(idCliente: number | undefined): Observable<Perfil> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Perfil>(`${this.apiUrl}/admin/ver/cliente/${idCliente}`, options);
    }

    getUsuario(idCliente: number): Observable<Usuario> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Usuario>(`${this.apiUrl}/admin/ver/usuario/${idCliente}`, options);
    }

    eliminarCliente(idCliente: number): Observable<void> {
        const options = this.comunService.autorizarPeticion();
        return this.http.delete<void>(`${this.apiUrl}/admin/eliminar/cliente/${idCliente}`, options);
    }

    actualizarPerfilCliente(actualizarCliente: FormData): Observable<ActualizarCliente> {
        const options = this.comunService.autorizarPeticionFormData();
        return this.http.put<ActualizarCliente>(`${this.apiUrl}/admin/actualizar/cliente`, actualizarCliente, options);
    }

    editarEstrellas(editarEstrellaDTO: EditarEstrellaDTO): Observable<void> {
        const options = this.comunService.autorizarPeticionFormData();
        return this.http.put<void>(`${this.apiUrl}/admin/editar/estrellas`, editarEstrellaDTO, options);
    }
}
