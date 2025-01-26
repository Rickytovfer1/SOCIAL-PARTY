import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-registrar-cliente',
    templateUrl: './registrar-cliente.component.html',
    styleUrls: ['./registrar-cliente.component.scss'],
    standalone: true,
    imports: [
        IonicModule
    ]
})
export class RegistrarClienteComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
