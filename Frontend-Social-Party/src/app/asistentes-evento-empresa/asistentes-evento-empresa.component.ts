import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";
import {NavInferiorEmpresaComponent} from "../nav-inferior-empresa/nav-inferior-empresa.component";
import {Router} from "@angular/router";

@Component({
    selector: 'app-asistentes-evento-empresa',
    templateUrl: './asistentes-evento-empresa.component.html',
    styleUrls: ['./asistentes-evento-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorEmpresaComponent,
        NavInferiorEmpresaComponent
    ]
})
export class AsistentesEventoEmpresaComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
    }


    irCanjearEntrada(){
        this.router.navigate(['/canjear-entrada-empresa'])
    }
}
