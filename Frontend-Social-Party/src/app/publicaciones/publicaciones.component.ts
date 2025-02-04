import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { Router } from "@angular/router";
import { PublicacionService, MostrarPublicacionDTO } from '../servicios/publicacion.service';
import { UsuarioService } from '../servicios/usuario.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormsModule } from "@angular/forms";
import {jwtDecode } from 'jwt-decode';
import {TokenDataDTO} from "../modelos/TokenDataDTO";



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
        HttpClientModule,
        NgOptimizedImage,
        FormsModule
    ]
})
export class PublicacionesComponent implements OnInit {
    publicaciones: MostrarPublicacionDTO[] = [];
    publicacionesFiltradas: MostrarPublicacionDTO[] = [];
    buscar: string = '';
    baseUrl: string = environment.apiUrl;
    currentUserId: number | undefined = 0;

    constructor(
        private router: Router,
        private publicacionService: PublicacionService,
        private usuarioService: UsuarioService
    ) {}

    ngOnInit() {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode<{ tokenDataDTO: TokenDataDTO }>(token);
                const tokenDataDTO = decodedToken?.tokenDataDTO;
                if (tokenDataDTO && tokenDataDTO.correo) {
                    const correo = tokenDataDTO.correo;
                    this.usuarioService.getUsuario(correo).subscribe({
                        next: usuario => {
                            this.currentUserId = usuario.id;
                            this.publicacionService.listarFeed(this.currentUserId).subscribe({
                                next: (data: MostrarPublicacionDTO[]) => {
                                    this.publicaciones = data;
                                    this.publicacionesFiltradas = data;
                                },
                                error: err => {
                                    console.error('Error fetching publicaciones:', err);
                                }
                            });
                        },
                        error: err => {
                            console.error("Error al cargar el usuario:", err);
                        }
                    });
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

    verPublicacion() {
        this.router.navigate(["/ver-noticia"]);
    }

    ionViewWillEnter() {
        this.ngOnInit();
    }
}
