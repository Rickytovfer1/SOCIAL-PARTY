import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun.service";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Perfil} from "../modelos/Perfil";
import {Usuario} from "../modelos/Usuario";
import {PerfilEmpresa} from "../modelos/PerfilEmpresa";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

    private apiUrl = environment.apiUrl;


    constructor(private http: HttpClient, private comunService: ComunService) { }

    getUsuario(correo: string | undefined): Observable<Usuario> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Perfil>(`${this.apiUrl}/cliente/ver/usuario/${correo}`, options);
    }
    getUsuarioEmpresa(correo: string): Observable<Usuario> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<PerfilEmpresa>(`${this.apiUrl}/empresa/ver/perfil/${correo}`, options);
    }
    getUsuarioPublicacion(id: number): Observable<string> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<string>(`${this.apiUrl}/cliente/publicacion/${id}`, options);
    }

    verificacion(dni: string, telefono: string, correo: string): Observable<boolean> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<boolean>(`${this.apiUrl}/verificar?dni=${dni}&telefono=${telefono}&correo=${correo}`, options);
    }

}
