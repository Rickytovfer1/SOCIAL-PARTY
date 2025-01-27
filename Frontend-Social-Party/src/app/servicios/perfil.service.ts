import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Perfil} from "../modelos/Perfil";

@Injectable({
  providedIn: 'root'
})
export class PerfilServicio {

  constructor(private http: HttpClient) { }

    getPerfil(idUsuario: number): Observable<Perfil> {
        return this.http.get<Perfil>(`/api/cliente/buscar/${idUsuario}`);
    }

}
