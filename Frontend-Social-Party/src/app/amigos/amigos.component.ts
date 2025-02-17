import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { IonicModule } from "@ionic/angular";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { UsuarioService } from "../servicios/usuario.service";
import { AmigoService } from "../servicios/amigo.service";
import { SolicitudService } from "../servicios/SolicitudService";
import { SocketService } from "../servicios/SocketService";
import { NotificacionService } from "../servicios/NotificacionService";
import { Usuario } from "../modelos/Usuario";
import { Cliente } from "../modelos/Cliente";
import { jwtDecode } from "jwt-decode";
import { TokenDataDTO } from "../modelos/TokenDataDTO";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { NavLateralComponent } from "../nav-lateral/nav-lateral.component";

@Component({
    selector: 'app-amigos',
    templateUrl: './amigos.component.html',
    styleUrls: ['./amigos.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent,
        NgOptimizedImage,
        NavLateralComponent
    ]
})
export class AmigosComponent implements OnInit {
    baseUrl: string = environment.apiUrl;
    usuario: Usuario = {} as Usuario;
    amigos: Cliente[] = [];
    correo?: string;
    pendingNotificaciones: number = 0;
    pendingSolicitudes: number = 0;
    socketSubscription: any;

    constructor(
        private usuarioService: UsuarioService,
        private amigoService: AmigoService,
        private solicitudService: SolicitudService,
        private socketService: SocketService,
        private notificacionService: NotificacionService,
        private router: Router,
        private zone: NgZone,
        private cd: ChangeDetectorRef
    ) {}

    get pendingBadge(): number {
        return this.pendingNotificaciones + this.pendingSolicitudes;
    }

    ngOnInit() {
        this.inicio();
    }

    inicio() {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token) as { tokenDataDTO: TokenDataDTO };
                const tokenDataDTO = decodedToken?.tokenDataDTO;
                if (tokenDataDTO && tokenDataDTO.correo) {
                    this.correo = tokenDataDTO.correo;
                    this.cargarUsuario(this.correo);
                }
            } catch (e) {
                console.error('Error al decodificar el token', e);
            }
        }
    }

    cargarUsuario(correo: string): void {
        this.usuarioService.getUsuario(correo).subscribe({
            next: (usuario: Usuario) => {
                this.usuario = usuario;
                if (usuario && usuario.id) {
                    this.cargarAmigos(usuario.id);
                    this.cargarNotificaciones(usuario.id);
                    this.cargarSolicitudesPendientes(usuario.id);
                    this.socketService.subscribeToNotificaciones(usuario.id);
                    this.socketService.subscribeToSolicitudes(usuario.id);
                    if (!this.socketSubscription) {
                        this.socketSubscription = this.socketService.listenEvent().subscribe((data: any) => {
                            this.zone.run(() => {
                                if (data) {
                                    if (data.tipo === 'comentario' || data.tipo === 'like' || data.tipo === 'notificacion' || data.tipo === 'mensaje') {
                                        this.pendingNotificaciones++;
                                    } else if (data.tipo === 'solicitud') {
                                        this.pendingSolicitudes++;
                                    }
                                    this.cd.detectChanges();
                                }
                            });
                        });
                    }
                }
            },
            error: (e) => {
                console.error('Error al cargar el usuario', e);
            }
        });
    }

    cargarAmigos(idUsuario: number): void {
        this.amigoService.getAmigos(idUsuario).subscribe({
            next: (amigos: Cliente[]) => {
                this.amigos = amigos;
            },
            error: (e) => {
                console.error('Error al cargar amigos', e);
            }
        });
    }

    cargarNotificaciones(idUsuario: number): void {
        this.notificacionService.getNotificacionesNoLeidas(idUsuario).subscribe({
            next: (notificaciones) => {
                this.pendingNotificaciones = notificaciones.length;
            },
            error: (e) => {
                console.error('Error al cargar notificaciones', e);
            }
        });
    }

    cargarSolicitudesPendientes(idUsuario: number): void {
        this.solicitudService.getSolicitudes(idUsuario).subscribe({
            next: (solicitudes) => {
                this.pendingSolicitudes = solicitudes.length;
            },
            error: (e) => {
                console.error('Error al cargar solicitudes pendientes', e);
            }
        });
    }

    abrirChat(idUsuario: number) {
        this.router.navigate(['/chat', idUsuario]);
    }

    verSolicitudes() {
        this.router.navigate(['/ver-solicitudes']);
    }

    verAmigos() {
        this.router.navigate(['/gestion-amigos']);
    }

    getImageUrlCliente(clienteDTO: Cliente): string {
        if (!clienteDTO.fotoPerfil || clienteDTO.fotoPerfil.trim() === '') {
            return 'assets/iconoPerfil.png';
        } else if (clienteDTO.fotoPerfil.startsWith('http')) {
            return clienteDTO.fotoPerfil;
        } else {
            return `${this.baseUrl}${clienteDTO.fotoPerfil}`;
        }
    }

    ionViewWillEnter() {
        this.inicio();
    }
}
