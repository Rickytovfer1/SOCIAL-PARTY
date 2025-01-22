import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";

@Component({
  selector: 'app-nav-lateral',
  templateUrl: './nav-lateral.component.html',
  styleUrls: ['./nav-lateral.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NavSuperiorComponent
  ]
})
export class NavLateralComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
