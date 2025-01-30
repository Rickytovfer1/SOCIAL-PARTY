import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";
import {NavInferiorEmpresaComponent} from "../nav-inferior-empresa/nav-inferior-empresa.component";

@Component({
    selector: 'app-crear-evento-empresa',
    templateUrl: './crear-evento-empresa.component.html',
    styleUrls: ['./crear-evento-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorEmpresaComponent,
        NavInferiorEmpresaComponent
    ]
})
export class CrearEventoEmpresaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
