import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NavSuperiorComponent } from '../nav-superior/nav-superior.component';
import { NavInferiorComponent } from '../nav-inferior/nav-inferior.component';
import { NgIf } from '@angular/common';
import { PublicacionService, MostrarPublicacionDTO } from '../servicios/publicacion.service';
import { PerfilServicio } from '../servicios/perfil.service';
import { TipoUsuarioDTO } from '../modelos/TipoUsuarioDTO';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-ver-noticia',
    templateUrl: './ver-noticia.component.html',
    styleUrls: ['./ver-noticia.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent,
        NgIf
    ]
})
export class VerNoticiaComponent implements OnInit {
    publicacion?: MostrarPublicacionDTO;
    perfilEmpresa?: TipoUsuarioDTO;
    baseUrl: string = environment.apiUrl;
    publicationId!: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private publicacionService: PublicacionService,
        private perfilServicio: PerfilServicio
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.publicationId = Number(params['id']);
            this.loadPublication(this.publicationId);
        });
    }

    loadPublication(id: number): void {
        this.publicacionService.getPublicacion(id).subscribe({
            next: (data: MostrarPublicacionDTO) => {
                this.publicacion = data;
                if (this.publicacion.idUsuario) {
                    this.perfilServicio.getPerfilEmpresaUsuario(this.publicacion.idUsuario).subscribe({
                        next: (perfil: TipoUsuarioDTO) => {
                            this.perfilEmpresa = perfil;
                        },
                        error: (err: any) => console.error('Error fetching TipoUsuario', err)
                    });
                }
            },
            error: (err) => console.error('Error fetching publication', err)
        });
    }


    getImageUrl(): string {
        if (this.publicacion && this.publicacion.foto) {
            return this.publicacion.foto.startsWith('http')
                ? this.publicacion.foto
                : `${this.baseUrl}${this.publicacion.foto}`;
        }
        return 'assets/default-image.png';
    }
}
