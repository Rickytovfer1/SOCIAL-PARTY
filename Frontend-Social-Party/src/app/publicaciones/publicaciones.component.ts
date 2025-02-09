import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { Router } from "@angular/router";
import { PublicacionService} from '../servicios/publicacion.service';
import { UsuarioService } from '../servicios/usuario.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { environment } from '../../environments/environment';
import { FormsModule } from "@angular/forms";
import {jwtDecode } from 'jwt-decode';
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {Usuario} from "../modelos/Usuario";
import {Perfil} from "../modelos/Perfil";
import {PerfilServicio} from "../servicios/perfil.service";
import {MostrarPublicacion} from "../modelos/MostrarPublicacion";


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
    publicaciones: MostrarPublicacion[] = [];
    publicacionesFiltradas: MostrarPublicacion[] = [];
    filtroSeleccionado: string = 'todas';

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
        this.rolesPublicaciones = {}
        this.perfilesPublicaciones = []
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
                this.filtrarPublicaciones(this.filtroSeleccionado);
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

    getImageUrl(publicacion: MostrarPublicacion): string {
        if (!publicacion.foto) {
            return ""
        }
        if (publicacion.foto.startsWith('http')) {
            return publicacion.foto;
        } else {
            return `${this.baseUrl}${publicacion.foto}`;
        }
    }

    calcularFecha(publicacion: MostrarPublicacion): string {
        if (!publicacion.fecha) {
            return "";
        }

        const fechaActual = new Date();
        const fechaPublicacion = new Date(publicacion.fecha);
        const milisegundos = fechaActual.getTime() - fechaPublicacion.getTime();

        const minutos = 1000 * 60;
        const horas   = minutos * 60;
        const dias    = horas * 24;
        const meses  = dias * 30;
        const anios   = dias * 365;

        if (milisegundos >= anios) {
            const years = Math.floor(milisegundos / anios);
            return `Hace ${years} ${years === 1 ? "año" : "años"}`;
        } else if (milisegundos >= meses) {
            const months = Math.floor(milisegundos / meses);
            return `Hace ${months} ${months === 1 ? "mes" : "meses"}`;
        } else if (milisegundos >= dias) {
            const days = Math.floor(milisegundos / dias);
            return `Hace ${days} ${days === 1 ? "día" : "días"}`;
        } else if (milisegundos >= horas) {
            const hours = Math.floor(milisegundos / horas);
            return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
        } else if (milisegundos >= minutos) {
            const minutes = Math.floor(milisegundos / minutos);
            return `Hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
        } else {
            return "Hace un momento";
        }
    }

    obtenerFecha(publicacion: MostrarPublicacion): string {
        if (!publicacion.fecha) {
            return "";
        }

        let fecha = new Date(publicacion.fecha)

        const formateador = new Intl.DateTimeFormat('es-ES', { month: 'long' });
        const mesEsp = formateador.format(fecha);

        return fecha.getDate() + " de " + mesEsp + " de " + fecha.getFullYear()
    }

    filtrarPublicaciones(tipo: string) {
        this.filtroSeleccionado = tipo;

        if (tipo === 'todas') {
            this.publicacionesFiltradas = this.publicaciones
        } else if (tipo === 'tuyas') {
            for (const publicacion of this.publicaciones) {
                if (publicacion.idUsuario === this.perfil.id) {
                    this.publicacionesFiltradas.push(publicacion)
                }
            }
        }
    }

    buscarPublicaciones() {
        const consulta = this.buscar.trim().toLowerCase();
        if (consulta === '') {
            this.filtrarPublicaciones(this.filtroSeleccionado);
        } else {
            this.publicacionesFiltradas = this.publicaciones.filter(publicacion =>
                publicacion.nombre?.toLowerCase().includes(consulta)
            );
        }
    }

    // cargarRolesUsuarios() {
    //     for (const publicacion of this.publicaciones) {
    //         this.usuarioService.getUsuarioPublicacion(publicacion.idUsuario).subscribe({
    //             next: (data) => {
    //                 this.rolesPublicaciones[publicacion.idUsuario] = data;
    //             },
    //             error: (e) => {
    //                 console.error("Error al cargar el rol de usuario:", e);
    //             }
    //         });
    //     }
    // }
    //
    // cargarPerfilesPublicaciones() {
    //     for (const publicacion of this.publicaciones) {
    //         if (this.rolesPublicaciones[publicacion.id] === 'CLIENTE') {
    //             this.perfilService.getPerfil(publicacion.idUsuario).subscribe({
    //                 next: (data) => {
    //                     this.perfilesPublicaciones.push(data)
    //                 },
    //                 error: (e) => {
    //                     console.error("Error al cargar los nombres: "+ publicacion.texto);
    //                 }
    //             })
    //         }
    //     }
    // }
    //
    // cargarRolPublicacion(publicacion: MostrarPublicacion): boolean {
    //     let rolUsuario = this.rolesPublicaciones[publicacion.id];
    //     if (rolUsuario === 'EMPRESA') {
    //         return true;
    //     }
    //     return false
    // }
    //
    // cargarNombreUsuario(publicacion: MostrarPublicacion): string {
    //     let nombre = ""
    //     for (const perfil of this.perfilesPublicaciones) {
    //         if (publicacion.idUsuario === perfil.id) {
    //             nombre = perfil.nombre + " " + perfil.apellidos
    //         }
    //     }
    //     return nombre
    // }

    ionViewWillEnter() {
        this.ngOnInit();
    }
}
