import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { ActivatedRoute } from "@angular/router";
import { Perfil } from "../modelos/Perfil";
import { PerfilServicio } from "../servicios/perfil.service";
import {jwtDecode }from "jwt-decode";
import { DecodedToken } from "../modelos/DecodedToken";
import { TokenDataDTO } from "../modelos/TokenDataDTO";
import { UsuarioService } from "../servicios/usuario.service";
import { Usuario } from "../modelos/Usuario";
import { ClienteService } from "../servicios/cliente.service";
import { ActualizarCliente } from "../modelos/ActualizarCliente";
import { FormsModule } from "@angular/forms";
import {DatePipe, NgIf} from "@angular/common";

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent,
        FormsModule,
    ]
})
export class PerfilComponent implements OnInit {

    usuario: Usuario = {} as Usuario;
    perfil: Perfil = {} as Perfil;
    correo?: string;
    editar: boolean = false;

    registro: ActualizarCliente = {
        id: 0,
        nombre: "",
        apellidos: "",
        dni: "",
        fechaNacimiento: "",
        telefono: "",
        correo: "",
        fotoPerfil: "",
        biografia: "",
        contrasena: "", // Es recomendable manejar la contraseña por separado
    }

    constructor(
        private perfilService: PerfilServicio,
        private activateRoute: ActivatedRoute,
        private usuarioService: UsuarioService,
        private clienteService: ClienteService
    ) {}

    ngOnInit() {
        const token = sessionStorage.getItem('authToken');
        console.log('Auth Token:', token);

        if (token) {
            try {
                const decodedToken = jwtDecode<{ tokenDataDTO: TokenDataDTO }>(token);
                console.log('Decoded Token:', decodedToken);

                const tokenDataDTO = decodedToken?.tokenDataDTO;

                if (tokenDataDTO && tokenDataDTO.correo) {
                    this.correo = tokenDataDTO.correo;
                    console.log('Correo obtenido del token:', this.correo);

                    this.cargarUsuario(this.correo);
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

    cargarPerfil(idUsuario: number | undefined): void {
        this.perfilService.getPerfil(idUsuario).subscribe({
            next: (perfil: Perfil) => {
                this.perfil = perfil;
                console.log('Perfil cargado:', this.perfil);

                if (this.perfil.id) {
                    this.registro = {
                        id: this.perfil.id,
                        nombre: this.perfil.nombre,
                        apellidos: this.perfil.apellidos,
                        dni: this.perfil.dni,
                        fechaNacimiento: this.perfil.fechaNacimiento || "",
                        telefono: this.perfil.telefono,
                        correo: this.perfil.correo,
                        fotoPerfil: this.perfil.fotoPerfil || "",
                        biografia: this.perfil.biografia || "",
                        contrasena: ""
                    };
                } else {
                    console.error('El perfil no tiene un ID válido.');
                }
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    cargarUsuario(correo: string | undefined): void {
        this.usuarioService.getUsuario(correo).subscribe({
            next: (usuario: Usuario) => {
                this.usuario = usuario;
                console.log('Usuario cargado:', this.usuario);

                if (usuario && usuario.id) {
                    this.cargarPerfil(usuario.id);
                } else {
                    console.error('El usuario no tiene un ID válido.');
                }
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    actualizarCliente(): void {
        if (this.registro.id === 0 || !this.registro.id) {
            console.error("ID del cliente no válido.");
            return;
        }

        this.perfilService.actualizarPerfil(this.registro).subscribe({
            next: (respuesta) => {
                console.log('Usuario actualizado:', respuesta);
                this.editar = false;
                this.cargarPerfil(this.registro.id);
            },
            error: (e) => {
                console.error("Error al actualizar el usuario:", e);
            }
        });
    }

    editarBoton(): void {
        if (this.editar) {
            this.actualizarCliente();
        } else {
            this.editar = true;
        }
    }

}
