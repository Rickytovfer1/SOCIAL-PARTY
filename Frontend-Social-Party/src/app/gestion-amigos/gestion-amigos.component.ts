import { Component, OnInit } from '@angular/core';
import {AlertController, IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {Usuario} from "../modelos/Usuario";
import {Cliente} from "../modelos/Cliente";
import {UsuarioService} from "../servicios/usuario.service";
import {AmigoService} from "../servicios/amigo.service";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {NgForOf, NgIf} from "@angular/common";
import {NgOptimizedImage} from "@angular/common";
import {Perfil} from "../modelos/Perfil";
import {environment} from "../../environments/environment";
import {NavLateralComponent} from "../nav-lateral/nav-lateral.component";
import {AmigosComponent} from "../amigos/amigos.component";

@Component({
    selector: 'app-gestion-amigos',
    templateUrl: './gestion-amigos.component.html',
    styleUrls: ['./gestion-amigos.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent,
        NgForOf,
        NgForOf,
        NgIf,
        NavLateralComponent,
        AmigosComponent
    ]
})
export class GestionAmigosComponent  implements OnInit {
    baseUrl: string = environment.apiUrl;
    usuario: Usuario = {} as Usuario;
    amigos: Cliente[] = [];
    correo?: string;

    constructor(
        private usuarioService: UsuarioService,
        private amigoService: AmigoService,
        private router: Router,
        private alertController: AlertController
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

    async confirmarEliminarAmigo(idAmigo: number) {
        const alert = await this.alertController.create({
            header: 'Confirmar eliminación',
            message: '¿Estás seguro de que quieres dejar de ser amigo de este usuario?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        console.log('Eliminación cancelada');
                    }
                },
                {
                    text: 'Eliminar',
                    handler: () => {
                        this.eliminarAmigo(idAmigo);
                    }
                }
            ]
        });

        await alert.present();
    }

    eliminarAmigo(idAmigo: number) {
        if (this.usuario.id)
        this.amigoService.eliminarAmigo(this.usuario.id, idAmigo).subscribe({
            next: () => {
                console.log("Amigo eliminado")
                const toast = document.getElementById("toastEliminarAmigo") as any;
                toast.present();
                this.ngOnInit()
            },
            error: () => {console.error("Error al eliminar amigo")}
        })
    }

    verPerfil(cliente: Cliente) {
        this.router.navigate(["/perfil-asistente", cliente.idUsuario])
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
        this.inicio()
    }

}
