import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {Router} from "@angular/router";
import {PublicacionService} from "../servicios/publicacion.service";
import {UsuarioService} from "../servicios/usuario.service";
import {PerfilServicio} from "../servicios/perfil.service";
import {AmigoService} from "../servicios/amigo.service";
import {FavoritoService} from "../servicios/favorito.service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {Usuario} from "../modelos/Usuario";
import {Perfil} from "../modelos/Perfil";
import {environment} from "../../environments/environment";
import {EventoService} from "../servicios/evento.service";
import {ClienteService} from "../servicios/cliente.service";
import {Cliente} from "../modelos/Cliente";
import {Evento} from "../modelos/Evento";
import {Empresa} from "../modelos/Empresa";
import {NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'app-asistentes-evento',
    templateUrl: './asistentes-evento.component.html',
    styleUrls: ['./asistentes-evento.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent,
        NgForOf,
        NgIf
    ]
})
export class AsistentesEventoComponent  implements OnInit {

    baseUrl: string = environment.apiUrl;
    correo?: string;
    usuario: Usuario = {} as Usuario;
    perfil: Cliente = {} as Cliente;
    evento: Evento = {} as Evento;
    empresa: Empresa = {} as Empresa;
    asistentes: Cliente[]  = [];
    amigos: Cliente[]  = [];

    constructor(
        private router: Router,
        private usuarioService: UsuarioService,
        private clienteService: ClienteService,
        private amigoService: AmigoService,
        private eventoService: EventoService
    ) {}

    ngOnInit() {
        this.inicio()
    }

    inicio() {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode<{ tokenDataDTO: TokenDataDTO }>(token);
                const tokenDataDTO = decodedToken?.tokenDataDTO;
                if (tokenDataDTO && tokenDataDTO.correo) {
                    this.correo = tokenDataDTO.correo;
                    this.cargarUsuario(this.correo);
                }
            } catch (e) {
                console.error('Error al decodificar el token:', e);
            }
        }
    }

    cargarUsuario(correo: string | undefined): void {
        this.usuarioService.getUsuario(correo).subscribe({
            next: (usuario: Usuario) => {
                this.usuario = usuario;
                if (usuario && usuario.id) {
                    this.cargarPerfil(usuario.id);
                }
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    cargarPerfil(idUsuario: number): void {
        this.clienteService.getCliente(idUsuario).subscribe({
            next: (perfil: Cliente) => {
                this.perfil = perfil;
                this.cargarEvento()
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    cargarEvento() {
        this.eventoService.verEvento(this.perfil.evento).subscribe({
            next: (data) => {
                this.evento = data;
                this.cargarEmpresaEvento()
            }
        })
    }

    cargarEmpresaEvento() {
        this.eventoService.verEmpresa(this.evento.idEmpresa).subscribe({
            next: data => {
                this.empresa = data;
                this.cargarAsistentes()
            }
        })
    }

    cargarAsistentes() {
        this.eventoService.verPersonasEvento(this.evento.id).subscribe({
            next: data => {
                this.asistentes = data;
                this.cargarAmigos()
            }
        })
    }

    cargarAmigos() {
        this.amigoService.getAmigos(this.perfil.id).subscribe({
            next: data => {
                this.amigos = data;
            }
        })
    }

    esAmigo(cliente: Cliente): boolean {
        return this.amigos.includes(cliente) || cliente.id === this.perfil.id;
    }

    verPerfil(cliente: Cliente) {
        this.router.navigate(["/perfil-asistente", cliente.idUsuario])
    }
}
