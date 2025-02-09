import { Component, OnInit } from '@angular/core';
import { IonicModule, IonDatetime } from "@ionic/angular";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { EmpresaService } from "../servicios/empresa.service";
import {jwtDecode } from "jwt-decode";
import { DecodedToken } from "../modelos/DecodedToken";
import { TokenDataDTO } from "../modelos/TokenDataDTO";
import { FormsModule } from "@angular/forms";
import { Empresa } from "../modelos/Empresa";

@Component({
    selector: 'app-ver-perfil-empresa',
    templateUrl: './ver-perfil-empresa.component.html',
    styleUrls: ['./ver-perfil-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent,
        FormsModule
    ]
})
export class VerPerfilEmpresaComponent implements OnInit {



    constructor(private empresaService: EmpresaService) { }

    ngOnInit(): void {
    }



}
