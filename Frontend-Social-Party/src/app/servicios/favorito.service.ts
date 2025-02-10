import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun.service";
import {Observable} from "rxjs";
import {Evento} from "../modelos/Evento";
import {Favorito} from "../modelos/Favorito";

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private comunService: ComunService) { }

    listarLikes(idCliente: number): Observable<Favorito[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Favorito[]>(`${this.apiUrl}/cliente/likes/${idCliente}`, options);
    }

    listarLikesPublicacion(idPublicacion: number): Observable<Favorito[]> {
        const options = this.comunService.autorizarPeticion();
        return this.http.get<Favorito[]>(`${this.apiUrl}/cliente/likes/publicacion/${idPublicacion}`, options);
    }

    darLike(favorito: Favorito): Observable<any> {
        const options = this.comunService.autorizarPeticion();
        return this.http.post(`${this.apiUrl}/cliente/like`, favorito, options);
    }

    quitarLike(favorito: Favorito): Observable<any> {
        const options = this.comunService.autorizarPeticion();
        return this.http.post(`${this.apiUrl}/cliente/dislike`, favorito, options);
    }
}
