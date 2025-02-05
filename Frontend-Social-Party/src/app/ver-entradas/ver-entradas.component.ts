import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";

@Component({
    selector: 'app-ver-entradas',
    templateUrl: './ver-entradas.component.html',
    styleUrls: ['./ver-entradas.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent
    ]
})
export class VerEntradasComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
