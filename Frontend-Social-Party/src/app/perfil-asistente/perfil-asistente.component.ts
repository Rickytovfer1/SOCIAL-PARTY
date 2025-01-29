import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-perfil-asistente',
    templateUrl: './perfil-asistente.component.html',
    styleUrls: ['./perfil-asistente.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent
    ]
})
export class PerfilAsistenteComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
