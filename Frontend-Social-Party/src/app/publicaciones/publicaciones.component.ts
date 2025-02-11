import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { Router } from "@angular/router";
import { PublicacionService, MostrarPublicacionDTO } from '../servicios/publicacion.service';
import { UsuarioService } from '../servicios/usuario.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { environment } from '../../environments/environment';
import { FormsModule } from "@angular/forms";
import {jwtDecode } from 'jwt-decode';
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {Usuario} from "../modelos/Usuario";
import {Perfil} from "../modelos/Perfil";
import {PerfilServicio} from "../servicios/perfil.service";


@Component({
    selector: 'app-publicaciones',
    templateUrl: './publicaciones.component.html',
    styleUrls: ['./publicaciones.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent,
        CommonModule,
        NgOptimizedImage,
        FormsModule
    ]
})
export class PublicacionesComponent implements OnInit {
    publicaciones: MostrarPublicacionDTO[] = [];
    publicacionesFiltradas: MostrarPublicacionDTO[] = [];
    buscar: string = '';
    baseUrl: string = environment.apiUrl;
    correo?: string;
    usuario: Usuario = {} as Usuario;
    perfil: Perfil = {} as Perfil;

    rolesPublicaciones: {[key: number]: string} = {};
    perfilesPublicaciones: Perfil[] = [];

    constructor(
        private router: Router,
        private publicacionService: PublicacionService,
        private usuarioService: UsuarioService,
        private perfilService: PerfilServicio
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
                    this.cargarPublicaciones();
                }
            } catch (e) {
                console.error('Error al decodificar el token:', e);
            }
        }
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

    cargarPublicaciones() {
        this.publicacionService.listarPublicaciones().subscribe({
            next: (data) => {
                this.publicaciones = data;
                console.log(data)
                this.cargarPerfilesPublicaciones()
                this.cargarRolesUsuarios()
            },
            error: (e) => {
                console.error("Error al cargar las publicaciones:", e);
            }
        })
    }

    cargarPerfil(idUsuario: number | undefined): void {
        this.perfilService.getPerfil(idUsuario).subscribe({
            next: (perfil: Perfil) => {
                this.perfil = perfil;
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    abrirForm() {
        this.router.navigate(["/crear-publicacion"]);
    }

    onSearchChange(event: any) {
        const val = event.target.value.toLowerCase();
        if (val) {
            this.publicacionesFiltradas = this.publicaciones.filter(publicacion =>
                (publicacion.titulo?.toLowerCase().includes(val)) ||
                publicacion.texto.toLowerCase().includes(val) ||
                (publicacion.direccion?.toLowerCase().includes(val))
            );
        } else {
            this.publicacionesFiltradas = this.publicaciones;
        }
    }

    getImageUrl(publicacion: MostrarPublicacionDTO): string {
        if (publicacion.foto.startsWith('http')) {
            return publicacion.foto;
        } else {
            return `${this.baseUrl}${publicacion.foto}`;
        }
    }

    verPublicacion(publicacion: MostrarPublicacionDTO) {
        this.router.navigate(['/ver-noticia', publicacion.id], { state: { publicacion } });
    }

    cargarRolesUsuarios() {
        for (const publicacion of this.publicaciones) {
            this.usuarioService.getUsuarioPublicacion(publicacion.idUsuario).subscribe({
                next: (data) => {
                    this.rolesPublicaciones[publicacion.idUsuario] = data;
                },
                error: (e) => {
                    console.error("Error al cargar el rol de usuario:", e);
                }
            });
        }
    }

    cargarPerfilesPublicaciones() {
        for (const publicacion of this.publicaciones) {
            this.perfilService.getPerfil(publicacion.idUsuario).subscribe({
                next: (data) => {
                    this.perfilesPublicaciones.push(data)
                },
                error: (e) => {
                    console.error("Error al cargar los nombres: "+ publicacion.texto);
                }
            })
        }
    }

    cargarRolPublicacion(publicacion: MostrarPublicacionDTO): boolean {
        let rolUsuario = this.rolesPublicaciones[publicacion.id];
        if (rolUsuario === 'EMPRESA') {
            return true;
        }
        return false
    }

    cargarNombreUsuario(publicacion: MostrarPublicacionDTO): string {
        let nombre = ""
        for (const perfil of this.perfilesPublicaciones) {
            if (publicacion.idUsuario === perfil.id) {
                nombre = perfil.nombre + " " + perfil.apellidos
            }
        }
        return nombre
    }

    ionViewWillEnter() {
        this.ngOnInit();
    }
}
