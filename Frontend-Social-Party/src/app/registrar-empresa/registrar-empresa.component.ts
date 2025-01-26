import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-registrar-empresa',
    templateUrl: './registrar-empresa.component.html',
    styleUrls: ['./registrar-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule
    ]
})
export class RegistrarEmpresaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
