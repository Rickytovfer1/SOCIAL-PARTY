import { Component, OnInit } from '@angular/core';
import { PublicacionEmpresaService } from '../servicios/publicacion-empresa.service';
import { MostrarPublicacionDTO } from '../servicios/publicacion.service';
import { Router } from "@angular/router";
import { IonicModule, AlertController } from '@ionic/angular';
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";

import { FormsModule } from "@angular/forms";
import { environment } from '../../environments/environment';
import { UsuarioService } from "../servicios/usuario.service";
import { TokenDataDTO } from "../modelos/TokenDataDTO";
import { Usuario } from "../modelos/Usuario";
import { jwtDecode } from "jwt-decode";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";
import {NavInferiorEmpresaComponent} from "../nav-inferior-empresa/nav-inferior-empresa.component";

@Component({
    selector: 'app-publicaciones-empresa',
    templateUrl: './publicaciones-empresa.component.html',
    styleUrls: ['./publicaciones-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        NavSuperiorEmpresaComponent,
        NavInferiorEmpresaComponent
    ]
})
export class PublicacionesEmpresaComponent implements OnInit {
    publicaciones: MostrarPublicacionDTO[] = [];
    publicacionesFiltradas: MostrarPublicacionDTO[] = [];
    buscar: string = '';
    baseUrl: string = environment.apiUrl;
    idUsuario!: number;

    constructor(
        private router: Router,
        private publicacionEmpresaService: PublicacionEmpresaService,
        private alertController: AlertController,
        private usuarioService: UsuarioService
    ) { }

    ngOnInit() {
        this.autenticarUsuario().then(isAuthenticated => {
            if (isAuthenticated) {
                this.cargarPublicaciones(this.idUsuario);
            }
        });
    }

    async autenticarUsuario(): Promise<boolean> {
        const token = sessionStorage.getItem('authToken');

        if (token) {
            try {
                const decodedToken = jwtDecode<{ tokenDataDTO: TokenDataDTO }>(token);
                const correo = decodedToken.tokenDataDTO.correo;

                if (correo) {
                    await this.cargarUsuario(correo);
                    return true;
                } else {
                    await this.presentAlert('Error', 'Correo no encontrado en el token.');
                    this.router.navigate(['/login']);
                    return false;
                }
            } catch (e) {
                await this.presentAlert('Error', 'Token inválido.');
                this.router.navigate(['/login']);
                return false;
            }
        } else {
            await this.presentAlert('Error', 'No se encontró el token de autenticación.');
            this.router.navigate(['/login']);
            return false;
        }
    }

    cargarUsuario(correo: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.usuarioService.getUsuarioEmpresa(correo).subscribe({
                next: (usuario: Usuario) => {
                    if (usuario.id !== undefined) {
                        this.idUsuario = usuario.id;
                        this.cargarPublicaciones(usuario.id);
                        resolve();
                    } else {
                        this.presentAlert('Error', 'El usuario no tiene un ID válido.');
                        this.router.navigate(['/login']);
                        reject();
                    }
                },
                error: () => {
                    this.presentAlert('Error', 'No se pudo cargar el usuario.');
                    this.router.navigate(['/login']);
                    reject();
                }
            });
        });
    }

    cargarPublicaciones(idUsuario: number) {
        this.publicacionEmpresaService.listarPublicacionesEmpresa(idUsuario).subscribe({
            next: data => {
                this.publicaciones = data;
                this.publicacionesFiltradas = data;
            },
            error: err => {
                if (err.status === 401) {
                    this.presentAlert('Error', 'No autorizado. Por favor, inicia sesión nuevamente.');
                    this.router.navigate(['/login']);
                } else if (err.status === 403) {
                    this.presentAlert('Error', 'No tienes permisos para acceder a esta sección.');
                } else {
                    this.presentAlert('Error', 'Ocurrió un error al cargar las publicaciones.');
                }
            }
        });
    }

    ionViewWillEnter() {
        if (this.idUsuario) {
            this.cargarPublicaciones(this.idUsuario);
        }
    }

    abrirForm() {
        this.router.navigate(["/empresa/crear/publicacion"]);
    }

    onSearchChange(event: any) {
        const val = event.target.value.toLowerCase();
        if (val) {
            this.publicacionesFiltradas = this.publicaciones.filter((publicacion) =>
                (publicacion.titulo?.toLowerCase().includes(val)) ||
                publicacion.texto.toLowerCase().includes(val) ||
                (publicacion.direccion?.toLowerCase().includes(val))
            );
        } else {
            this.publicacionesFiltradas = this.publicaciones;
        }
    }

    getImageUrl(publicacion: MostrarPublicacionDTO): string {
        if (publicacion.foto.startsWith('http')) {
            return publicacion.foto;
        } else {
            return `${this.baseUrl}${publicacion.foto}`;
        }
    }

    verPublicacion(publicacionId: number) {
        this.router.navigate(["/ver/noticia", publicacionId]);
    }

    async presentAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: ['OK']
        });
        await alert.present();
    }
}
