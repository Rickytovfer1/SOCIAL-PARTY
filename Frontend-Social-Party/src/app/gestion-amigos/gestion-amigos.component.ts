import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {Usuario} from "../modelos/Usuario";
import {Cliente} from "../modelos/Cliente";
import {UsuarioService} from "../servicios/usuario.service";
import {AmigoService} from "../servicios/amigo.service";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'app-gestion-amigos',
    templateUrl: './gestion-amigos.component.html',
    styleUrls: ['./gestion-amigos.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent,
        NgForOf
    ]
})
export class GestionAmigosComponent  implements OnInit {

    usuario: Usuario = {} as Usuario;
    amigos: Cliente[] = [];
    correo?: string;

    constructor(
        private usuarioService: UsuarioService,
        private amigoService: AmigoService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.inicio()
    }

    inicio() {
        const token = sessionStorage.getItem('authToken');
        console.log('Auth Token:', token);

        if (token) {
            try {
                const decodedToken = jwtDecode(token) as { tokenDataDTO: TokenDataDTO };
                console.log('Decoded Token:', decodedToken);

                const tokenDataDTO = decodedToken?.tokenDataDTO;

                if (tokenDataDTO && tokenDataDTO.correo) {
                    this.correo = tokenDataDTO.correo;
                    console.log('Correo obtenido del token:', this.correo);

                    this.cargarUsuario(this.correo!);
                } else {
                    console.error('El token no contiene un correo válido en tokenDataDTO');
                }
            } catch (e) {
                console.error('Error al decodificar el token:', e);
            }
        } else {
            console.warn('No se encontró el token de autenticación en sessionStorage');
        }
    }

    cargarUsuario(correo: string): void {
        this.usuarioService.getUsuario(correo).subscribe({
            next: (usuario: Usuario) => {
                this.usuario = usuario;
                console.log('Usuario cargado:', this.usuario);

                if (usuario && usuario.id) {
                    this.cargarAmigos(usuario.id);
                } else {
                    console.error('El usuario no tiene un ID válido.');
                }
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    cargarAmigos(idUsuario: number): void {
        this.amigoService.getAmigos(idUsuario).subscribe({
            next: (amigos: Cliente[]) => {
                this.amigos = amigos;
                console.log('Amigos cargados:', this.amigos);
            },
            error: (e) => {
                console.error("Error al cargar los amigos:", e);
            }
        });
    }

    eliminarAmigo(idAmigo: number) {
        if (this.usuario.id)
        this.amigoService.eliminarAmigo(this.usuario.id, idAmigo).subscribe({
            next: () => {console.log("Amigo eliminado")},
            error: () => {console.error("Error al eliminar amigo")}
        })
    }

}
