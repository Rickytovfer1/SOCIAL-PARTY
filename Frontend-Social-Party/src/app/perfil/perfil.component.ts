import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {ActivatedRoute} from "@angular/router";
import {Perfil} from "../modelos/Perfil";
import {PerfilServicio} from "../servicios/perfil.service";

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent,
    ]
})
export class PerfilComponent implements OnInit {

    perfil: Perfil = {} as Perfil;
    id!:number;

    constructor(private perfilService: PerfilServicio,
                private activateRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.cargarPerfil(10);

    }

    cargarPerfil(idUsuario: number): void {
        this.perfilService.getPerfil(idUsuario).subscribe({
                next: (perfil: Perfil) => {
                    this.perfil = perfil;
                },
                error: (e) => {
                    console.error("Error");
                },
                complete: () =>
                    console.info(this.perfil)

            }
        );
    }
}
