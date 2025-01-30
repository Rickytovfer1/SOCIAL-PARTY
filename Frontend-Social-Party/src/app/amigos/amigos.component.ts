import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from "@ionic/angular";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { UsuarioService } from "../servicios/usuario.service";
import { AmigoService } from "../servicios/AmigoService";
import { Usuario } from "../modelos/Usuario";
import { ClienteDTO } from "../modelos/ClienteDTO";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../modelos/DecodedToken";
import { TokenDataDTO } from "../modelos/TokenDataDTO";
import { Router } from "@angular/router";

@Component({
    selector: 'app-amigos',
    templateUrl: './amigos.component.html',
    styleUrls: ['./amigos.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent
    ]
})
export class AmigosComponent implements OnInit {

    usuario: Usuario = {} as Usuario;
    amigos: ClienteDTO[] = [];
    correo?: string;

    constructor(
        private usuarioService: UsuarioService,
        private amigoService: AmigoService,
        private router: Router,
    ) {}

    ngOnInit() {
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
            next: (amigos: ClienteDTO[]) => {
                this.amigos = amigos;
                console.log('Amigos cargados:', this.amigos);
            },
            error: (e) => {
                console.error("Error al cargar los amigos:", e);
            }
        });
    }

    // Component
    abrirChat(idUsuario: number) {
        this.router.navigate(['/chat', idUsuario]);
    }


}
