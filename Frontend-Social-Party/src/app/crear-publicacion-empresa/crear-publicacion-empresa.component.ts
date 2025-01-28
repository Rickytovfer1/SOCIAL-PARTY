import { Component, OnInit } from '@angular/core';
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";

@Component({
    selector: 'app-crear-publicacion-empresa',
    templateUrl: './crear-publicacion-empresa.component.html',
    styleUrls: ['./crear-publicacion-empresa.component.scss'],
    standalone: true,
    imports: [
        NavSuperiorComponent,
        IonicModule,
        NavInferiorComponent
    ]
})
export class CrearPublicacionEmpresaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
