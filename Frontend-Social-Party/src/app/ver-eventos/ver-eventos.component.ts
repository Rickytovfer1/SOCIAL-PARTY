import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { EventoService } from "../servicios/evento.service";
import { Evento } from "../modelos/Evento";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {environment} from "../../environments/environment";
import {Empresa} from "../modelos/Empresa";
import {NavLateralComponent} from "../nav-lateral/nav-lateral.component";
import {AmigosComponent} from "../amigos/amigos.component";
import {EmpresaService} from "../servicios/empresa.service";
import {Usuario} from "../modelos/Usuario";

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
        NgIf,
        NavLateralComponent,
        AmigosComponent
    ]
})
export class VerEventosComponent implements OnInit {
    empresa: Empresa = {} as Empresa;
    usuario: Usuario = {} as Usuario;

    eventos: Evento[] = [];
    idEmpresa!: number;
    baseUrl: string = environment.apiUrl;

    constructor(
        private eventoService: EventoService,
        private activateRoute: ActivatedRoute,
        private router: Router,
        private empresaService: EmpresaService
    ) {}

    ngOnInit() {
        this.activateRoute.params.subscribe(params => {
            this.idEmpresa = Number(params['id']);
        });
        this.verEmpresa(this.idEmpresa)
        this.cargarGrupos(this.idEmpresa)
        this.cargarUsuario(this.idEmpresa)
    }

    cargarUsuario(idEmpresa: number): void {
        this.empresaService.getUsuarioEmpresa(idEmpresa).subscribe({
            next: (usuario: Usuario) => {
                this.usuario = usuario;
            },
            error: (e) => {
                console.error("Error");
            },
            complete: () =>
                console.info(this.usuario)
        });
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

    verEvento(idEvento: number) {
        this.router.navigate(["/ver-evento-info", idEvento])
    }

    getImageUrlEmpresa(): string {
        if (this.empresa && this.empresa.fotoPerfil) {
            if (this.empresa.fotoPerfil.startsWith('http')) {
                return this.empresa.fotoPerfil;
            } else {
                return `${this.baseUrl}${this.empresa.fotoPerfil}`;
            }
        }
        return 'assets/iconoPerfil.png';
    }
    verEmpresa(idEmpresa: number | undefined): void {
        this.eventoService.verEmpresa(idEmpresa).subscribe({
            next: (empresa: Empresa) => {
                this.empresa = empresa;
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }
}
