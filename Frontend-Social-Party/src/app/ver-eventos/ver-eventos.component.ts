import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventoService } from "../servicios/evento.service";
import { Evento } from "../modelos/Evento";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {MostrarPublicacionDTO} from "../servicios/publicacion.service";
import {environment} from "../../environments/environment";

@Component({
    selector: 'app-ver-eventos',
    templateUrl: './ver-eventos.component.html',
    styleUrls: ['./ver-eventos.component.scss'],
    standalone: true,
    imports: [
        NavSuperiorComponent,
        IonicModule,
        NavInferiorComponent,
        NgForOf,
        NgOptimizedImage
    ]
})
export class VerEventosComponent implements OnInit {

    eventos: Evento[] = [];
    idEmpresa!: number;
    publicaciones: MostrarPublicacionDTO[] = [];
    baseUrl: string = environment.apiUrl;

    constructor(
        private eventoService: EventoService,
        private activateRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.activateRoute.params.subscribe(params => {
            this.idEmpresa = Number(params['id']);
        });
        this.cargarGrupos(this.idEmpresa)
    }

    cargarGrupos(id: number): void {
        this.eventoService.getEventos(id).subscribe({

            next: (evento: Evento[]) => {
                this.eventos = evento;
            },
            error: (e) => {
                console.error("Error");
            },
            complete: () =>
                console.info(this.eventos)
        });
    }

    getImageUrl(evento: Evento): string {
        if (evento.foto.startsWith('http')) {
            return evento.foto;
        } else {
            return `${this.baseUrl}${evento.foto}`;
        }
    }
}
