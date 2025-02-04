import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorEmpresaComponent} from "../nav-inferior-empresa/nav-inferior-empresa.component";
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";

@Component({
    selector: 'app-confirmacion-pago',
    templateUrl: './confirmacion-pago.component.html',
    styleUrls: ['./confirmacion-pago.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorEmpresaComponent,
        NavSuperiorEmpresaComponent
    ]
})
export class ConfirmacionPagoComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
