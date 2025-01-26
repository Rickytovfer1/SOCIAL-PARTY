import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-nav-superior',
  templateUrl: './nav-superior.component.html',
  styleUrls: ['./nav-superior.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class NavSuperiorComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
