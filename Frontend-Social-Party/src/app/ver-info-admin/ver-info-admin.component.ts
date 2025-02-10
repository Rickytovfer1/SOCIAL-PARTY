import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavSuperiorAdminComponent} from "../nav-superior-admin/nav-superior-admin.component";
import {NavInferiorAdminComponent} from "../nav-inferior-admin/nav-inferior-admin.component";
import {ClienteDTO} from "../modelos/ClienteDTO";
import {environment} from "../../environments/environment";
import {EmpresaDTO} from "../modelos/EmpresaDTO";
import {ActivatedRoute} from "@angular/router";
import {Evento} from "../modelos/Evento";

@Component({
    selector: 'app-ver-info-admin',
    templateUrl: './ver-info-admin.component.html',
    styleUrls: ['./ver-info-admin.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent,
        NavSuperiorAdminComponent,
        NavInferiorAdminComponent
    ]
})
export class VerInfoAdminComponent implements OnInit {
    baseUrl: string = environment.apiUrl;
    cliente: ClienteDTO = {} as ClienteDTO;
    constructor(private activateRoute: ActivatedRoute) {

    }

    ngOnInit() {
    }

    getImageUrlCliente(clienteDTO: ClienteDTO): string {
        if (!clienteDTO.fotoPerfil || clienteDTO.fotoPerfil.trim() === '') {
            return 'assets/iconoPerfil.png';
        } else if (clienteDTO.fotoPerfil.startsWith('http')) {
            return clienteDTO.fotoPerfil;
        } else {
            return `${this.baseUrl}${clienteDTO.fotoPerfil}`;
        }
    }

}
