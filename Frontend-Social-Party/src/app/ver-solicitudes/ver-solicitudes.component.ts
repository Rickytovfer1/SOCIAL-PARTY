import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { SolicitudDTO } from '../modelos/solicitud.dto';
import { UsuarioService } from '../servicios/usuario.service';
import { jwtDecode } from "jwt-decode";
import { SolicitudService } from '../servicios/SolicitudService';
import { PerfilServicio } from '../servicios/perfil.service';
import { Perfil } from '../modelos/Perfil';
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { NgForOf, NgIf } from "@angular/common";
import { environment } from "../../environments/environment";
import { SocketService } from '../servicios/SocketService';
import { TokenDataDTO } from "../modelos/TokenDataDTO";
import { Usuario } from "../modelos/Usuario";
import { Cliente } from "../modelos/Cliente";
import { Router } from "@angular/router";
import { ClienteService } from "../servicios/cliente.service";
import { AmigoService } from "../servicios/amigo.service";
import { EventoService } from "../servicios/evento.service";
import { Empresa } from "../modelos/Empresa";
import { NotificacionDTO } from '../modelos/NotificacionDTO';
import { NotificacionService } from '../servicios/NotificacionService';

@Component({
    selector: 'app-ver-solicitudes',
    templateUrl: './ver-solicitudes.component.html',
    styleUrls: ['./ver-solicitudes.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent,
        NgForOf,
        NgIf
    ]
})
export class VerSolicitudesComponent implements OnInit {

    solicitudes: SolicitudDTO[] = [];
    notificaciones: NotificacionDTO[] = [];
    correo?: string;
    usuario: Usuario = {} as Usuario;
    perfil: Cliente = {} as Cliente;
    clientesSolicitudes: Cliente[] = [];
    baseUrl: string = environment.apiUrl;

    constructor(
        private router: Router,
        private usuarioService: UsuarioService,
        private perfilServicio: PerfilServicio,
        private alertController: AlertController,
        private socketService: SocketService,
        private zone: NgZone,
        private clienteService: ClienteService,
        private amigoService: AmigoService,
        private eventoService: EventoService,
        private solicitudService: SolicitudService,
        private notificacionService: NotificacionService
    ) { }

    ngOnInit() {
        this.inicio();
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
                this.cargarSolicitudes();
                this.cargarNotificaciones();
                this.socketService.subscribeToSolicitudes(this.perfil.idUsuario);
                this.socketService.listenEvent().subscribe((data: any) => {
                    this.zone.run(() => {
                        console.log('Received solicitud event:', data);
                        this.handleSolicitudEvent(data);
                    });
                });
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    handleSolicitudEvent(data: any) {
        const action = data.action;
        const solicitud: SolicitudDTO = data.solicitud;
        if (!action || !solicitud) return;
        if (action === 'create') {
        } else if (action === 'accept' || action === 'delete') {
            this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
        }
    }

    cargarSolicitudes() {
        this.solicitudService.getSolicitudes(this.perfil.idUsuario).subscribe({
            next: (data: SolicitudDTO[]) => {
                this.solicitudes = data;
                this.cargarClientesSolicitudes();
            },
            error: (err) => {
                console.error('Error al cargar solicitudes', err);
            }
        });
    }

    cargarNotificaciones() {
        this.notificacionService.getNotificacionesNoLeidas(this.perfil.idUsuario).subscribe({
            next: (data: NotificacionDTO[]) => {
                this.notificaciones = data;
            },
            error: (err) => {
                console.error('Error al cargar notificaciones', err);
            }
        });
    }

    cargarClientesSolicitudes() {
        for (const solicitud of this.solicitudes) {
            this.clienteService.getCliente(solicitud.idUsuario1).subscribe({
                next: (data: Cliente) => {
                    this.clientesSolicitudes.push(data);
                },
                error: e => {
                    console.error('Error al cargar los clientes de las solicitudes', e);
                }
            });
        }
    }

    aceptarSolicitud(cliente: Cliente) {
        for (const solicitud of this.solicitudes) {
            if (solicitud.idUsuario1 === cliente.idUsuario) {
                this.solicitudService.aceptarSolicitud(solicitud.idUsuario1, solicitud.idUsuario2).subscribe({
                    next: () => {
                        this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
                        const toast = document.getElementById("toastSolocitudAceptada") as any;
                        toast.present();
                        this.refreshData();
                    },
                    error: (err) => {
                        console.error('Error al aceptar solicitud', err);
                    }
                });
                break;
            }
        }
    }

    eliminarSolicitud(cliente: Cliente) {
        for (const solicitud of this.solicitudes) {
            if (solicitud.idUsuario1 === cliente.idUsuario) {
                this.solicitudService.eliminarSolicitud(solicitud.id).subscribe({
                    next: () => {
                        this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
                        const toast = document.getElementById("toastSolocitudRechazada") as any;
                        toast.present();
                        this.refreshData();
                    },
                    error: (err) => {
                        console.error('Error al eliminar solicitud', err);
                    }
                });
                break;
            }
        }
    }

    getImageUrl(cliente: Cliente): string {
        if (cliente && cliente.fotoPerfil) {
            return cliente.fotoPerfil.startsWith('http')
                ? cliente.fotoPerfil
                : `${this.baseUrl}${cliente.fotoPerfil}`;
        }
        return 'assets/iconoPerfil.png';
    }

    verPerfil(cliente: Cliente) {
        this.router.navigate(["/perfil-asistente", cliente.idUsuario]);
    }

    trackBySolicitud(index: number, solicitud: SolicitudDTO): number {
        return solicitud.id;
    }

    refreshData() {
        this.solicitudes = [];
        this.clientesSolicitudes = [];
        this.cargarSolicitudes();
        this.cargarNotificaciones();
    }

    ionViewWillEnter() {
        this.refreshData();
    }

    markNotificationAsRead(notif: NotificacionDTO): void {
        this.notificacionService.marcarComoLeida(notif.id).subscribe({
            next: () => {
                this.notificaciones = this.notificaciones.filter(n => n.id !== notif.id);
            },
            error: (err) => {
                console.error("Error marking notification as read:", err);
            }
        });
    }

    navigateToNotification(notif: NotificacionDTO): void {
        this.notificacionService.marcarComoLeida(notif.id).subscribe({
            next: () => {
                this.notificaciones = this.notificaciones.filter(n => n.id !== notif.id);
                if (notif.tipo === 'mensaje' && notif.idReferencia) {
                    this.router.navigate(['/chat', notif.idReferencia]);
                } else if (notif.tipo === 'comentario' && notif.idReferencia) {
                    this.router.navigate(['/comentarios', notif.idReferencia]);
                }
            },
            error: (err) => {
                console.error("Error marking notification as read:", err);
            }
        });
    }

}
