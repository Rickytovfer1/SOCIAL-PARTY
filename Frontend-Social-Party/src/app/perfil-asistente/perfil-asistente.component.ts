import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NgIf} from "@angular/common";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {environment} from "../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {Usuario} from "../modelos/Usuario";
import {Cliente} from "../modelos/Cliente";
import {UsuarioService} from "../servicios/usuario.service";
import {ClienteService} from "../servicios/cliente.service";
import {AmigoService} from "../servicios/amigo.service";
import {EventoService} from "../servicios/evento.service";
import {SolicitudService} from "../servicios/SolicitudService";
import {SolicitudDTO} from "../modelos/solicitud.dto";
import {Evento} from "../modelos/Evento";

@Component({
    selector: 'app-perfil-asistente',
    templateUrl: './perfil-asistente.component.html',
    styleUrls: ['./perfil-asistente.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent,
        NgIf
    ]
})
export class PerfilAsistenteComponent  implements OnInit {

    idUsuarioPerfil!: number;
    correo?: string;
    baseUrl: string = environment.apiUrl;
    usuario: Usuario = {} as Usuario;
    perfil: Cliente = {} as Cliente;
    perfilActual: Cliente = {} as Cliente;
    amigos: Cliente[]  = [];

    asistentes: Cliente[] = [];
    evento: Evento = {} as Evento;
    solicitudes: SolicitudDTO[] = [];

    botonDesactivado: boolean = false;

    constructor(private activateRoute: ActivatedRoute,
                private usuarioService: UsuarioService,
                private clienteService: ClienteService,
                private amigoService: AmigoService,
                private solicitudService: SolicitudService) { }

    ngOnInit() {
        this.inicio()
    }

    inicio() {
        this.activateRoute.params.subscribe(params => {
            this.idUsuarioPerfil = Number(params['id']);
        });
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
                this.cargarPerfil()
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    cargarPerfil(): void {
        this.clienteService.getCliente(this.usuario.id).subscribe({
            next: (perfil: Cliente) => {
                this.perfil = perfil;
                this.cargarPerfilActual();
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    cargarPerfilActual(): void {
        this.clienteService.getCliente(this.idUsuarioPerfil).subscribe({
            next: (perfil: Cliente) => {
                this.perfilActual = perfil;
                this.cargarAmigos();
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    cargarAmigos() {
        this.amigoService.getAmigos(this.perfil.idUsuario).subscribe({
            next: data => {
                this.amigos = data;
                this.cargarSolicitudes()
            },
            error: (e) => {console.error("Error al cargar los amigos:", e);}
        })
    }

    cargarSolicitudes() {
        this.solicitudService.getSolicitudes(this.perfil.idUsuario).subscribe({
            next: (data: SolicitudDTO[]) => {
                this.solicitudes = data;
                this.comprobarSolicitud()
            },
            error: (err) => {
                console.error('Error al cargar solicitudes', err);
            }
        });
    }

    comprobarSolicitud() {
        for (const solicitud of this.solicitudes) {
            if (solicitud.idUsuario1 === this.perfil.id && solicitud.idUsuario2 === this.perfilActual.id) {
                this.botonDesactivado = true;
                break;
            }
        }
    }

    esAmigo(cliente: Cliente): boolean {
        let encontrado = false;
        for (const amigo of this.amigos){
            if (amigo.id === cliente.id) {
                encontrado = true;
                break;
            }
        }
        if (cliente.nombre === this.perfil.nombre) {
            encontrado = true;
        }
        return encontrado;
    }

    enviarSolicitud() {

        this.botonDesactivado = true

        const solicitud: SolicitudDTO = {
            id: 0,
            idUsuario1: this.perfil.idUsuario,
            idUsuario2: this.perfilActual.idUsuario
        }

        this.solicitudService.enviarSolicitud(solicitud).subscribe({
            next: () => {
                console.log("Solicitud enviada: ", solicitud)
            },
            error: e => {
                console.error("Error al mandar solicitud")
            }
        })
    }

}
