import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun.service";
import {Favorito} from "../modelos/Favorito";
import {Observable} from "rxjs";
import {Comentario} from "../modelos/Comentario";
import {environment} from "../../environments/environment";
import {ComentarioEnvio} from "../modelos/ComentarioEnvio";

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private comunService: ComunService) { }

    enviarComentario(comentario: ComentarioEnvio): Observable<any> {
        const options = this.comunService.autorizarPeticion();
        return this.http.post(`${this.apiUrl}/cliente/nuevo/comentario`, comentario, options);
    }
}
