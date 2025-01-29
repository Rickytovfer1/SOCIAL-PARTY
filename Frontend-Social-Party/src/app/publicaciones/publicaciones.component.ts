import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { Router } from "@angular/router";
import { PublicacionService, MostrarPublicacionDTO } from '../servicios/publicacion.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormsModule } from "@angular/forms";

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

    constructor(private router: Router, private publicacionService: PublicacionService) { }

    ngOnInit() {
        this.publicacionService.listarPublicaciones().subscribe(data => {
            this.publicaciones = data;
            this.publicacionesFiltradas = data;
        });
    }

    abrirForm() {
        this.router.navigate(["/crear-publicacion"]);
    }

    onSearchChange(event: any) {
        const val = event.target.value.toLowerCase();
        if (val) {
            this.publicacionesFiltradas = this.publicaciones.filter((publicacion) =>
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
