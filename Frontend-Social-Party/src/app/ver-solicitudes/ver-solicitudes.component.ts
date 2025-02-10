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
import {environment} from "../../environments/environment"; // Se asume que Perfil tiene una propiedad "nombre"

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
    idUsuario!: number;
    baseUrl: string = environment.apiUrl;

    constructor(
        private solicitudService: SolicitudService,
        private usuarioService: UsuarioService,
        private perfilServicio: PerfilServicio,
        private alertController: AlertController
    ) { }

    ngOnInit() {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const correo = this.obtenerCorreoDelToken(token);
                if (correo) {
                    this.usuarioService.getUsuario(correo).subscribe({
                        next: (usuario) => {
                            if (usuario.id !== undefined) {
                                this.idUsuario = usuario.id;
                                this.cargarSolicitudes();
                            } else {
                                this.presentAlert('Error', 'El usuario no tiene un ID válido.');
                            }
                        },
                        error: () => {
                            this.presentAlert('Error', 'No se pudo cargar el usuario.');
                        }
                    });
                }
            } catch (error) {
                this.presentAlert('Error', 'Token inválido.');
            }
        } else {
            this.presentAlert('Error', 'No se encontró el token de autenticación.');
        }
    }

    cargarSolicitudes() {
        this.solicitudService.getSolicitudes(this.idUsuario).subscribe({
            next: (data: SolicitudDTO[]) => {
                this.solicitudes = data;
                this.solicitudes.forEach(solicitud => {
                    this.perfilServicio.getPerfil(solicitud.idUsuario1).subscribe({
                        next: (perfil) => {
                            if (perfil.fotoPerfil && perfil.fotoPerfil.startsWith('http')) {
                                solicitud.imagenPerfil = perfil.fotoPerfil;
                            } else {
                                solicitud.imagenPerfil = `${this.baseUrl}${perfil.fotoPerfil}`;
                            }
                            solicitud.nombreUsuario = perfil.nombre + ' ' + perfil.apellidos;
                        },
                        error: (err) => {
                            console.error('Error al cargar el perfil del usuario', err);
                            solicitud.imagenPerfil = 'assets/iconoPerfil.png';
                            solicitud.nombreUsuario = 'Nombre usuario';
                        }
                    });

                });


            },
            error: (err) => {
                console.error('Error al cargar solicitudes', err);
                this.presentAlert('Error', 'No se pudieron cargar las solicitudes.');
            }
        });
    }

    aceptarSolicitud(solicitud: SolicitudDTO) {
        this.solicitudService.aceptarSolicitud(solicitud.idUsuario1, solicitud.idUsuario2).subscribe({
            next: () => {
                this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
                this.presentAlert('Éxito', 'Solicitud aceptada.');
            },
            error: (err) => {
                console.error('Error al aceptar solicitud', err);
                this.presentAlert('Error', 'No se pudo aceptar la solicitud.');
            }
        });
    }

    eliminarSolicitud(solicitud: SolicitudDTO) {
        this.solicitudService.eliminarSolicitud(solicitud.id).subscribe({
            next: () => {
                this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
                this.presentAlert('Éxito', 'Solicitud eliminada.');
            },
            error: (err) => {
                console.error('Error al eliminar solicitud', err);
                this.presentAlert('Error', 'No se pudo eliminar la solicitud.');
            }
        });
    }

    async presentAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: ['OK']
        });
        await alert.present();
    }

    obtenerCorreoDelToken(token: string): string {
        const decoded: any = jwtDecode(token);
        return decoded.tokenDataDTO?.correo;
    }
}
