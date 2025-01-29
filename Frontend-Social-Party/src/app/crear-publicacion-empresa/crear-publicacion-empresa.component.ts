import { Component, OnInit } from '@angular/core';
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";
import {NavInferiorEmpresaComponent} from "../nav-inferior-empresa/nav-inferior-empresa.component";

@Component({
    selector: 'app-crear-publicacion-empresa',
    templateUrl: './crear-publicacion-empresa.component.html',
    styleUrls: ['./crear-publicacion-empresa.component.scss'],
    standalone: true,
    imports: [
        NavSuperiorComponent,
        IonicModule,
        NavInferiorComponent,
        NavSuperiorEmpresaComponent,
        NavInferiorEmpresaComponent
    ]
})
export class CrearPublicacionEmpresaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
