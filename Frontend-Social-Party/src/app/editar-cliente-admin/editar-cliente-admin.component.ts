import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { Perfil } from "../modelos/Perfil";
import { PerfilServicio } from "../servicios/perfil.service";
import { UsuarioService } from "../servicios/usuario.service";
import { Usuario } from "../modelos/Usuario";
import { ClienteService } from "../servicios/cliente.service";
import { ActualizarCliente } from "../modelos/ActualizarCliente";
import { FormsModule } from "@angular/forms";
import {NavSuperiorAdminComponent} from "../nav-superior-admin/nav-superior-admin.component";
import {NavInferiorAdminComponent} from "../nav-inferior-admin/nav-inferior-admin.component";
import {AdminService} from "../servicios/admin.service";
import {NgOptimizedImage} from "@angular/common";
import {Cliente} from "../modelos/Cliente";
import {environment} from "../../environments/environment";

@Component({
    selector: 'app-editar-cliente-admin',
    templateUrl: './editar-cliente-admin.component.html',
    styleUrls: ['./editar-cliente-admin.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule,
        NavSuperiorAdminComponent,
        NavInferiorAdminComponent,
        NgOptimizedImage
    ]
})
export class EditarClienteAdminComponent implements OnInit {
    usuario: Usuario = {} as Usuario;
    perfil: Perfil = {} as Perfil;
    correo?: string;
    editar: boolean = false;
    idCliente!: number;
    baseUrl: string = environment.apiUrl;

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
        private adminService: AdminService,
        private activateRoute: ActivatedRoute,
        private usuarioService: UsuarioService,
        private clienteService: ClienteService,
        private perfilService: PerfilServicio
    ) {}

    ngOnInit() {
        this.activateRoute.params.subscribe(params => {
            this.idCliente = Number(params['id']);
        });
        this.cargarPerfil(this.idCliente)
        this.cargarUsuario(this.idCliente)
    }

    cargarPerfil(idCliente: number | undefined): void {
        this.adminService.getClientePerfil(idCliente).subscribe({
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
        this.adminService.actualizarPerfilCliente(formData).subscribe({
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

    cargarUsuario(idCliente: number): void {
        this.adminService.getUsuario(idCliente).subscribe({
            next: (usuario: Usuario) => {
                this.usuario = usuario;
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
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
