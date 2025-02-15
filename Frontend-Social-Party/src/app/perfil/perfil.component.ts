import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { ActivatedRoute } from "@angular/router";
import { Perfil } from "../modelos/Perfil";
import { PerfilServicio } from "../servicios/perfil.service";
import { jwtDecode } from "jwt-decode";
import { TokenDataDTO } from "../modelos/TokenDataDTO";
import { UsuarioService } from "../servicios/usuario.service";
import { Usuario } from "../modelos/Usuario";
import { ClienteService } from "../servicios/cliente.service";
import { ActualizarCliente } from "../modelos/ActualizarCliente";
import { FormsModule } from "@angular/forms";
import {NavLateralComponent} from "../nav-lateral/nav-lateral.component";
import {DatePipe, NgIf, NgOptimizedImage} from "@angular/common";
import {environment} from "../../environments/environment";

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
        NgOptimizedImage,
        FormsModule,
        NavLateralComponent
    ]
})
export class PerfilComponent implements OnInit {
    baseUrl: string = environment.apiUrl;
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
        contrasena: ""
    };
    foto: File | null = null;

    constructor(
        private perfilService: PerfilServicio,
        private activateRoute: ActivatedRoute,
        private usuarioService: UsuarioService,
        private clienteService: ClienteService
    ) {}

    ngOnInit() {
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

    cargarPerfil(idUsuario: number | undefined): void {
        this.perfilService.getPerfil(idUsuario).subscribe({
            next: (perfil: Perfil) => {
                this.perfil = perfil;
                if (this.perfil.id) {
                    this.registro = {
                        id: this.perfil.id,
                        nombre: this.perfil.nombre || "",
                        apellidos: this.perfil.apellidos || "",
                        dni: this.perfil.dni || "",
                        fechaNacimiento: this.perfil.fechaNacimiento || "",
                        telefono: this.perfil.telefono || "",
                        correo: this.perfil.correo || "",
                        fotoPerfil: this.perfil.fotoPerfil || "",
                        biografia: this.perfil.biografia || "",
                        contrasena: ""
                    };
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
                if (usuario && usuario.id) {
                    this.cargarPerfil(usuario.id);
                }
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    seleccionarFoto(event: any): void {
        if (event.target.files && event.target.files.length > 0) {
            this.foto = event.target.files[0];
            // @ts-ignore
            console.log('Foto seleccionada:', this.foto.name);
        }
    }

    actualizarCliente(): void {
        if (this.registro.id === 0 || !this.registro.id) {
            console.error("ID del cliente no válido.");
            return;
        }

        this.registro.correo = this.usuario.correo;

        const formData = new FormData();
        const clienteData = {
            id: this.registro.id,
            nombre: this.registro.nombre,
            apellidos: this.registro.apellidos,
            dni: this.registro.dni,
            fechaNacimiento: this.registro.fechaNacimiento,
            telefono: this.registro.telefono,
            correo: this.registro.correo,
            biografia: this.registro.biografia,
            fotoPerfil: this.registro.fotoPerfil
        };

        formData.append("cliente", new Blob([JSON.stringify(clienteData)], { type: "application/json" }));
        if (this.foto) {
            formData.append("fotoPerfil", this.foto);
        }
        this.perfilService.actualizarPerfil(formData).subscribe({
            next: (respuesta) => {
                console.log('Usuario actualizado:', respuesta);
                this.editar = false;
                this.cargarPerfil(this.registro.id);
                this.foto = null;
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

    getImageUrlCliente(clienteDTO: Perfil): string {
        if (!clienteDTO.fotoPerfil || clienteDTO.fotoPerfil.trim() === '') {
            return 'assets/iconoPerfil.png';
        } else if (clienteDTO.fotoPerfil.startsWith('http')) {
            return clienteDTO.fotoPerfil;
        } else {
            return `${this.baseUrl}${clienteDTO.fotoPerfil}`;
        }
    }
}
