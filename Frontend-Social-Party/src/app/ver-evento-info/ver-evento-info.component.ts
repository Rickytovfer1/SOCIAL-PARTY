import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Evento} from "../modelos/Evento";
import {EventoService} from "../servicios/evento.service";
import {Empresa} from "../modelos/Empresa";
import {environment} from "../../environments/environment";
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-ver-evento-info',
    templateUrl: './ver-evento-info.component.html',
    styleUrls: ['./ver-evento-info.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent,
        NgOptimizedImage
    ]
})
export class VerEventoInfoComponent implements OnInit {

    evento: Evento = {} as Evento;
    empresa: Empresa = {} as Empresa;
    idEvento!: number;
    baseUrl: string = environment.apiUrl;

    constructor(private router: Router,
                private eventoService: EventoService,
                private activateRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activateRoute.params.subscribe(params => {
            this.idEvento = Number(params['id']);
        });
        this.verEvento(this.idEvento)
    }

    comprarEntrada(idEvento: number) {
        this.router.navigate(["/confirmacion-pago", idEvento])
    }

    verEvento(idEvento: number): void {
        this.eventoService.verEvento(idEvento).subscribe({
            next: (eventos: Evento) => {
                this.evento = eventos;
                this.verEmpresa(this.evento.idEmpresa)
                console.log(this.evento)
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    verEmpresa(idEmpresa: number | undefined): void {
        this.eventoService.verEmpresa(idEmpresa).subscribe({
            next: (empresa: Empresa) => {
                this.empresa = empresa;
                console.log(this.empresa)
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    getImageUrl(evento: Evento): string {
        if (!evento.foto) {
            return 'placebo';
        }

        if (evento.foto.startsWith('http')) {
            return evento.foto;
        } else {
            return `${this.baseUrl}${evento.foto}`;
        }
    }



}
