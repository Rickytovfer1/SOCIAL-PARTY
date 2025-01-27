import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Perfil} from "../modelos/Perfil";

@Injectable({
  providedIn: 'root'
})
export class PerfilServicio {

  constructor(private http: HttpClient) { }

    getPerfil(idUsuario: number): Observable<Perfil> {
        const token = sessionStorage.getItem('authToken');

        let headers = new HttpHeaders();
        if (token) {
            headers = headers.append('Authorization', `Bearer ${token}`);
        }

        return this.http.get<Perfil>(`/api/cliente/buscar/${idUsuario}`, { headers: headers });
    }

}
