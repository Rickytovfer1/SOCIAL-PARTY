import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavLateralComponent} from "../nav-lateral/nav-lateral.component";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.scss'],
  standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavLateralComponent,
        NavInferiorComponent
    ]
})
export class AmigosComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
