import { Component } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";

@Component({
    selector: 'app-crear-publicacion',
    templateUrl: './crear-publicacion.component.html',
    styleUrls: ['./crear-publicacion.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent
    ]
})
export class CrearPublicacionComponent   {

  constructor() { }



}
