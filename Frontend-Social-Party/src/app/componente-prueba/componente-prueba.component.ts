import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavLateralComponent} from "../nav-lateral/nav-lateral.component";
import {AmigosComponent} from "../amigos/amigos.component";

@Component({
    selector: 'app-componente-prueba',
    templateUrl: './componente-prueba.component.html',
    styleUrls: ['./componente-prueba.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent,
        NavLateralComponent,
        AmigosComponent
    ]
})
export class ComponentePruebaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
