import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
    selector: 'app-nav-inferior-empresa',
    templateUrl: './nav-inferior-empresa.component.html',
    styleUrls: ['./nav-inferior-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule
    ]
})
export class NavInferiorEmpresaComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    irPerfil() {
        this.router.navigate(['/perfil-empresa']);
    }

    irEventos() {
        this.router.navigate(['/crear-evento-empresa']);
    }

    irUbicacion() {
        this.router.navigate(['/asistentes-evento-empresa']);
    }

    irPublicaciones() {
        this.router.navigate(['/crear-publicacion-empresa']);
    }

}
