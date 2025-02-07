import { Component, OnInit } from '@angular/core';
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-ver-solicitudes',
    templateUrl: './ver-solicitudes.component.html',
    styleUrls: ['./ver-solicitudes.component.scss'],
    standalone: true,
    imports: [
        NavSuperiorComponent,
        NavInferiorComponent,
        IonicModule
    ]
})
export class VerSolicitudesComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
