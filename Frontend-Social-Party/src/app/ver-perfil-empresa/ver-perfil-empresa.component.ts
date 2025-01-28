import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";

@Component({
    selector: 'app-ver-perfil-empresa',
    templateUrl: './ver-perfil-empresa.component.html',
    styleUrls: ['./ver-perfil-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent
    ]
})
export class VerPerfilEmpresaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
