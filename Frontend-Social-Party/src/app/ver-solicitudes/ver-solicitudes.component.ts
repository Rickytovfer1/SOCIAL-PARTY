import { Component, OnInit } from '@angular/core';
import {AlertController, IonicModule} from '@ionic/angular';
import { SolicitudDTO } from '../modelos/solicitud.dto';
import { UsuarioService } from '../servicios/usuario.service';
import{ jwtDecode  }from "jwt-decode";
import { SolicitudService } from '../servicios/SolicitudService';
import { PerfilServicio } from '../servicios/perfil.service';  // Asegúrate de que la ruta sea correcta
import { Perfil } from '../modelos/Perfil';
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NgForOf} from "@angular/common";
import {environment} from "../../environments/environment";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {Usuario} from "../modelos/Usuario";
import {Cliente} from "../modelos/Cliente";
import {Router} from "@angular/router";
import {ClienteService} from "../servicios/cliente.service";
import {AmigoService} from "../servicios/amigo.service";
import {EventoService} from "../servicios/evento.service";
import {Empresa} from "../modelos/Empresa"; // Se asume que Perfil tiene una propiedad "nombre"

@Component({
    selector: 'app-ver-solicitudes',
    templateUrl: './ver-solicitudes.component.html',
    styleUrls: ['./ver-solicitudes.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent,
        NgForOf
    ]
})
export class VerSolicitudesComponent implements OnInit {

    solicitudes: SolicitudDTO[] = [];
    correo?: string;
    usuario: Usuario = {} as Usuario;
    perfil: Cliente = {} as Cliente;
    clientesSolicitudes: Cliente[] = []
    baseUrl: string = environment.apiUrl;

    constructor(
        private router: Router,
        private usuarioService: UsuarioService,
        private clienteService: ClienteService,
        private amigoService: AmigoService,
        private eventoService: EventoService,
        private solicitudService: SolicitudService
    ) { }

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
                this.cargarSolicitudes()
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    cargarSolicitudes() {
        this.solicitudService.getSolicitudes(this.perfil.idUsuario).subscribe({
            next: (data: SolicitudDTO[]) => {
                this.solicitudes = data;
                this.cargarClientesSolicitudes()
            },
            error: (err) => {
                console.error('Error al cargar solicitudes', err);
            }
        });
    }

    cargarClientesSolicitudes() {
        for (const solicitud of this.solicitudes) {
            this.clienteService.getCliente(solicitud.idUsuario1).subscribe({
                next: (data: Cliente) => {
                    this.clientesSolicitudes.push(data);
                },
                error: e => {console.error('Error al cargar los clientes delas solicitudes', e)}
            })
        }
    }

    aceptarSolicitud(cliente: Cliente) {
        for (const solicitud of this.solicitudes) {
            if (solicitud.idUsuario1 === cliente.idUsuario) {
                this.solicitudService.aceptarSolicitud(solicitud.idUsuario1, solicitud.idUsuario2).subscribe({
                    next: () => {
                        this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
                    },
                    error: (err) => {
                        console.error('Error al aceptar solicitud', err);
                    }
                });
                break
            }
        }
    }

    eliminarSolicitud(cliente: Cliente) {
        for (const solicitud of this.solicitudes) {
            if (solicitud.idUsuario1 === cliente.idUsuario) {
                this.solicitudService.eliminarSolicitud(solicitud.id).subscribe({
                    next: () => {
                        this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
                    },
                    error: (err) => {
                        console.error('Error al aceptar solicitud', err);
                    }
                });
                break
            }
        }
    }

    getImageUrl(cliente: Cliente): string {
        if (cliente && cliente.fotoPerfil) {
            if (cliente.fotoPerfil.startsWith('http')) {
                return cliente.fotoPerfil;
            } else {
                return `${this.baseUrl}${cliente.fotoPerfil}`;
            }
        }
        return 'assets/iconoPerfil.png';
    }

    verPerfil(cliente: Cliente) {
        this.router.navigate(["/perfil-asistente", cliente.idUsuario])
    }
}
