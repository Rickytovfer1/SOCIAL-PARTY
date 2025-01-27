import { Component, OnInit } from '@angular/core';
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-ver-eventos',
  templateUrl: './ver-eventos.component.html',
  styleUrls: ['./ver-eventos.component.scss'],
  standalone: true,
  imports: [
    NavSuperiorComponent,
    NavInferiorComponent,
    IonicModule
  ]
})
export class VerEventosComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
