import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NavSuperiorComponent } from '../nav-superior/nav-superior.component';
import { NavInferiorComponent } from '../nav-inferior/nav-inferior.component';

import { MensajeDTO } from '../modelos/MensajeDTO';
import { Usuario } from '../modelos/Usuario';
import { TokenDataDTO } from '../modelos/TokenDataDTO';

import { MensajeService } from '../servicios/mensaje.service';
import { UsuarioService } from '../servicios/usuario.service';
import { jwtDecode }  from "jwt-decode";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {Perfil} from "../modelos/Perfil";
import {PerfilServicio} from "../servicios/perfil.service";

@Component({
    standalone: true,
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    imports: [
        CommonModule,
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent,
        FormsModule
    ]
})
export class ChatComponent implements OnInit {

    usuario: Usuario = { id: 0, nombre: '', correo: '' } as Usuario;
    mensajes: MensajeDTO[] = [];
    nuevoTexto: string = '';
    idReceptor: number = 0;
    perfil: Perfil = {} as Perfil;

    constructor(
        private mensajeService: MensajeService,
        private usuarioService: UsuarioService,
        private route: ActivatedRoute,
        private router: Router,
        private perfilService: PerfilServicio
    ) {}

    ngOnInit() {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            console.warn('No auth token found in sessionStorage');
            this.router.navigate(['/login']);
            return;
        }

        let decoded: any;
        try {
            decoded = jwtDecode(token);
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            this.router.navigate(['/login']);
            return;
        }

        const tokenData: TokenDataDTO | undefined = decoded?.tokenDataDTO;
        if (!tokenData?.correo) {
            console.error('No correo found in tokenDataDTO');
            this.router.navigate(['/login']);
            return;
        }

        this.usuarioService.getUsuario(tokenData.correo).pipe(
            switchMap((user: Usuario | undefined) => {
                if (!user || user.id === undefined) {
                    console.error("Usuario no encontrado o ID no válido.");
                    this.router.navigate(['/login']);
                    throw new Error("Usuario no encontrado");
                }

                this.usuario = user;
                return this.route.paramMap;
            })
        ).subscribe({
            next: (params) => {
                const receptorIdStr = params.get('id');
                const receptorId = receptorIdStr ? Number(receptorIdStr) : 0;

                // @ts-ignore
                if (receptorId > 0 && this.usuario.id > 0) {
                    this.idReceptor = receptorId;
                    this.cargarConversacion(this.usuario.id, this.idReceptor);
                    this.cargarPerfil(this.idReceptor)
                } else {
                    console.warn('Receptor ID o Usuario ID inválidos.');
                }
            },
            error: (err) => {
                console.error('Error al cargar usuario en chat:', err);
            }
        });
    }

    cargarConversacion(idEmisor?: number, idReceptor?: number) {
        if (idEmisor === undefined || idReceptor === undefined) {
            console.warn('IDs inválidos para cargar conversación.');
            return;
        }

        this.mensajeService.verConversacion(idEmisor, idReceptor).subscribe({
            next: (mensajes) => {
                this.mensajes = mensajes;
                console.log('Conversación cargada:', mensajes);
            },
            error: (err) => {
                console.error('Error al cargar conversación:', err);
            }
        });
    }

    enviar() {
        console.log('Intentando enviar mensaje...');
        console.log('Nuevo Texto:', this.nuevoTexto);
        console.log('Usuario ID:', this.usuario.id);
        console.log('ID Receptor:', this.idReceptor);

        if (!this.nuevoTexto.trim()) {
            console.warn('No se puede enviar un mensaje vacío.');
            return;
        }

        if (!this.usuario.id || !this.idReceptor) {
            console.warn('Usuario ID o Receptor ID no definidos.');
            return;
        }

        const mensaje: MensajeDTO = {
            texto: this.nuevoTexto.trim(),
            idEmisor: this.usuario.id!,
            idReceptor: this.idReceptor
        };

        this.mensajeService.enviarMensaje(mensaje).subscribe({
            next: () => {
                this.cargarConversacion(this.usuario.id!, this.idReceptor);
                this.nuevoTexto = '';
                console.log('Mensaje enviado exitosamente.');
            },
            error: (err) => {
                console.error('Error al enviar mensaje:', err);
            }
        });
    }

    cargarPerfil(idUsuario: number | undefined): void {
        this.perfilService.getPerfil(idUsuario).subscribe({
            next: (perfil: Perfil) => {
                this.perfil = perfil;
                console.log('Perfil cargado:', this.perfil);
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }
}
