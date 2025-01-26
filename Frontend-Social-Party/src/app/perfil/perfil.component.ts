import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NavSuperiorComponent,
    NavInferiorComponent,
  ]
})
export class PerfilComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
