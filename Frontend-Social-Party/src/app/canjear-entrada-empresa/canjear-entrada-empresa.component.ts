import { Component, OnInit } from '@angular/core';
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";
import {NavInferiorEmpresaComponent} from "../nav-inferior-empresa/nav-inferior-empresa.component";

@Component({
    selector: 'app-canjear-entrada-empresa',
    templateUrl: './canjear-entrada-empresa.component.html',
    styleUrls: ['./canjear-entrada-empresa.component.scss'],
    standalone: true,
    imports: [
        NavSuperiorEmpresaComponent,
        NavInferiorEmpresaComponent
    ]
})
export class CanjearEntradaEmpresaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
