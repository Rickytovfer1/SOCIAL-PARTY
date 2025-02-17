import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
    selector: 'app-nav-lateral-empresa',
    templateUrl: './nav-lateral-empresa.component.html',
    styleUrls: ['./nav-lateral-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule
    ]
})
export class NavLateralEmpresaComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

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
