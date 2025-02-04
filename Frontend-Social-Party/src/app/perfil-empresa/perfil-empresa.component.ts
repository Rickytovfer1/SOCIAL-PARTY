import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NavSuperiorEmpresaComponent } from "../nav-superior-empresa/nav-superior-empresa.component";
import { NavInferiorEmpresaComponent } from "../nav-inferior-empresa/nav-inferior-empresa.component";
import { Usuario } from "../modelos/Usuario";
import { PerfilEmpresa } from "../modelos/PerfilEmpresa";
import { PerfilServicio } from "../servicios/perfil.service";
import { ActivatedRoute } from "@angular/router";
import { UsuarioService } from "../servicios/usuario.service";
import { jwtDecode } from "jwt-decode";
import { TokenDataDTO } from "../modelos/TokenDataDTO";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-perfil-empresa',
    templateUrl: './perfil-empresa.component.html',
    styleUrls: ['./perfil-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        NavSuperiorEmpresaComponent,
        NavInferiorEmpresaComponent
    ]
})
export class PerfilEmpresaComponent implements OnInit {

    usuario: Usuario = {} as Usuario;
    perfilEmpresa: PerfilEmpresa = {} as PerfilEmpresa;
    correo?: string;
    editar: boolean = false;

    constructor(
        private perfilService: PerfilServicio,
        private activateRoute: ActivatedRoute,
        private usuarioService: UsuarioService
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

    cargarUsuario(correo: string): void {
        this.usuarioService.getUsuarioEmpresa(correo).subscribe({
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

    cargarPerfil(idUsuario: number): void {
        this.perfilService.getPerfilEmpresa(idUsuario).subscribe({
            next: (perfilEmpresa: PerfilEmpresa) => {
                this.perfilEmpresa = perfilEmpresa;
                console.log('Perfil de la empresa cargado:', this.perfilEmpresa);
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    editarBoton(): void {
        if (this.editar) {
            this.guardarCambios();
            this.editar = false;
        } else {
            this.editar = true;
        }
    }

    guardarCambios(): void {
        console.log('Guardando cambios...', this.perfilEmpresa);

        this.perfilService.updatePerfilEmpresa(this.perfilEmpresa).subscribe({
            next: (updatedPerfil: PerfilEmpresa) => {
                console.log('Perfil empresa actualizado:', updatedPerfil);
                this.perfilEmpresa = updatedPerfil;
            },
            error: (err) => {
                console.error('Error al actualizar la empresa:', err);
            }
        });
    }
}
