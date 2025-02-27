import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Evento} from "../modelos/Evento";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun.service";
import {Perfil} from "../modelos/Perfil";
import {ActualizarCliente} from "../modelos/ActualizarCliente";
import {Usuario} from "../modelos/Usuario";
import {EditarEstrellaDTO} from "../modelos/EditarEstrellaDTO";
import {Cliente} from "../modelos/Cliente";
import {Empresa} from "../modelos/Empresa";
import {PerfilEmpresa} from "../modelos/PerfilEmpresa";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private apiUrl = environment.apiUrl;


    constructor(private http: HttpClient, private comunService: ComunService) {
    }

    verClientes(): Observable<Cliente[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Cliente[]>(`${this.apiUrl}/admin/listar/clientes`, options);
    }

    verEmpresas(): Observable<Empresa[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Empresa[]>(`${this.apiUrl}/admin/listar/empresas`, options);
    }

    getCliente(idCliente: number): Observable<Cliente> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Cliente>(`${this.apiUrl}/admin/ver/cliente/${idCliente}`, options);
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

    banearCliente(idCliente: number): Observable<void> {
        const options = this.comunService.autorizarPeticionFormData();
        return this.http.post<void>(`${this.apiUrl}/admin/banear/cliente/${idCliente}`,{}, options);
    }

    eliminarBaneo(idCliente: number): Observable<void> {
        const options = this.comunService.autorizarPeticionFormData();
        return this.http.put<void>(`${this.apiUrl}/admin/eliminar/baneo/cliente/${idCliente}`,{}, options);
    }

    getEmpresaDTO(idEmpresa: number): Observable<Empresa> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Empresa>(`${this.apiUrl}/admin/ver/empresa/${idEmpresa}`, options);
    }

    getEmpresa(idEmpresa: number): Observable<PerfilEmpresa> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<PerfilEmpresa>(`${this.apiUrl}/admin/ver/empresa/${idEmpresa}`, options);
    }

    eliminarEmpresa(idEmpresa: number): Observable<void> {
        const options = this.comunService.autorizarPeticion();
        return this.http.delete<void>(`${this.apiUrl}/admin/eliminar/empresa/${idEmpresa}`, options);
    }

    getUsuarioEmpresa(idEmpresa: number): Observable<Usuario> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Usuario>(`${this.apiUrl}/admin/ver/usuario/empresa/${idEmpresa}`, options);
    }


    actualizarPerfilEmpresa(perfilEmpresa: FormData): Observable<PerfilEmpresa> {
        const options = this.comunService.autorizarPeticionFormData();
        return this.http.put<PerfilEmpresa>(
            `${this.apiUrl}/admin/actualizar/empresa`,
            perfilEmpresa,
            options
        );
    }
}
