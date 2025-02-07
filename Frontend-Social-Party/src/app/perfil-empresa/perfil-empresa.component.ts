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
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {MostrarPublicacionDTO} from "../servicios/publicacion.service";
import {EmpresaDTO} from "../modelos/EmpresaDTO";
import {environment} from "../../environments/environment";

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
        NavInferiorEmpresaComponent,
        NgOptimizedImage
    ]
})
export class PerfilEmpresaComponent implements OnInit {
    baseUrl: string = environment.apiUrl;

    usuario: Usuario = {} as Usuario;
    perfilEmpresa: PerfilEmpresa = {} as PerfilEmpresa;
    correo?: string;
    editar: boolean = false;
    foto: File | null = null;

    constructor(
        private perfilService: PerfilServicio,
        private activateRoute: ActivatedRoute,
        private usuarioService: UsuarioService
    ) {}

    ngOnInit() {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token) as { tokenDataDTO: TokenDataDTO };
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

    cargarUsuario(correo: string): void {
        this.usuarioService.getUsuarioEmpresa(correo).subscribe({
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

    cargarPerfil(idUsuario: number): void {
        this.perfilService.getPerfilEmpresa(idUsuario).subscribe({
            next: (perfilEmpresa: PerfilEmpresa) => {
                this.perfilEmpresa = perfilEmpresa;
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

    editarBoton(): void {
        if (this.editar) {
            this.guardarCambios();
            this.editar = false;
        } else {
            this.editar = true;
        }
    }

    guardarCambios(): void {
        const formData = new FormData();
        const empresaData = {
            id: this.perfilEmpresa.id,
            nombre: this.perfilEmpresa.nombre,
            direccion: this.perfilEmpresa.direccion,
            cp: this.perfilEmpresa.cp,
            telefono: this.perfilEmpresa.telefono,
            correo: this.usuario.correo,
            nif: this.perfilEmpresa.nif,
            edadMinima: this.perfilEmpresa.edadMinima || "",
            valoracionMinima: this.perfilEmpresa.valoracionMinima || ""
        };
        formData.append("empresa", new Blob([JSON.stringify(empresaData)], { type: "application/json" }));
        if (this.foto) {
            formData.append("fotoPerfil", this.foto);
        }
        this.perfilService.updatePerfilEmpresa(formData).subscribe({
            next: (updatedPerfil: PerfilEmpresa) => {
                this.perfilEmpresa = updatedPerfil;
                this.foto = null;
            },
            error: (err) => {
                console.error("Error al actualizar la empresa:", err);
            }
        });
    }

    getImageUrl(empresaDTO: PerfilEmpresa): string {
        if (!empresaDTO.fotoPerfil) {
            return 'assets/iconoPerfil.png';
        }
        if (empresaDTO.fotoPerfil.startsWith('http')) {
            return empresaDTO.fotoPerfil;
        } else {
            return `${this.baseUrl}${empresaDTO.fotoPerfil}`;
        }
    }


}
