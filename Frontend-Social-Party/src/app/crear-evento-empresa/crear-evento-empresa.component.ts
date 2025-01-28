import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";

@Component({
    selector: 'app-crear-evento-empresa',
    templateUrl: './crear-evento-empresa.component.html',
    styleUrls: ['./crear-evento-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent
    ]
})
export class CrearEventoEmpresaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
