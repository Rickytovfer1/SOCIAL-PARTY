import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";

@Component({
    selector: 'app-crear-evento-empresa',
    templateUrl: './crear-evento-empresa.component.html',
    styleUrls: ['./crear-evento-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent
    ]
})
export class CrearEventoEmpresaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
