import { Component, OnInit } from '@angular/core';
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { IonicModule, AlertController } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { PublicacionService } from '../servicios/publicacion.service';
import { UsuarioService } from "../servicios/usuario.service";
import { TokenDataDTO } from "../modelos/TokenDataDTO";
import { Usuario } from "../modelos/Usuario";
import {jwtDecode }from "jwt-decode";

@Component({
    selector: 'app-crear-publicacion-empresa',
    templateUrl: './crear-publicacion-empresa.component.html',
    styleUrls: ['./crear-publicacion-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent,
        CommonModule,
        FormsModule
    ]
})
export class CrearPublicacionEmpresaComponent implements OnInit {
    texto: string = '';
    titulo: string = '';
    direccion: string = '';
    foto: File | null = null;
    idUsuario?: number;

    constructor(
        private router: Router,
        private publicacionService: PublicacionService,
        private alertController: AlertController,
        private usuarioService: UsuarioService
    ) { }

    ngOnInit() {
        const token = sessionStorage.getItem('authToken');

        if (token) {
            try {
                const decodedToken = jwtDecode<{ tokenDataDTO: TokenDataDTO }>(token);
                const correo = decodedToken.tokenDataDTO.correo;

                if (correo) {
                    this.cargarUsuario(correo);
                } else {
                    this.presentAlert('Error', 'Correo no encontrado en el token.');
                }
            } catch (e) {
                this.presentAlert('Error', 'Token inválido.');
            }
        } else {
            this.presentAlert('Error', 'No se encontró el token de autenticación.');
        }
    }

    cargarUsuario(correo: string): void {
        this.usuarioService.getUsuarioEmpresa(correo).subscribe({
            next: (usuario: Usuario) => {
                if (usuario.id !== undefined) {
                    this.idUsuario = usuario.id;
                } else {
                    this.presentAlert('Error', 'El usuario no tiene un ID válido.');
                }
            },
            error: () => {
                this.presentAlert('Error', 'No se pudo cargar el usuario.');
            }
        });
    }

    seleccionarFoto(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            this.foto = event.target.files[0];
        }
    }

    publicar() {
        if (!this.foto) {
            this.presentAlert('Error', 'Por favor, selecciona una foto.');
            return;
        }

        if (this.idUsuario === undefined) {
            this.presentAlert('Error', 'Usuario no autenticado.');
            return;
        }

        if (!this.texto || !this.titulo || !this.direccion) {
            this.presentAlert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        const dto = {
            texto: this.texto,
            titulo: this.titulo,
            direccion: this.direccion,
            idUsuario: this.idUsuario
        };

        this.publicacionService.crearPublicacionEmpresa(dto, this.foto).subscribe({
            next: () => {
                this.presentAlert('Éxito', 'Publicación creada exitosamente.');
                this.router.navigate(['/publicaciones']);
            },
            error: () => {
                this.presentAlert('Error', 'Error al crear la publicación.');
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
}
