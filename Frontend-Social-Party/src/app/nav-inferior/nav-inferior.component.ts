import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-nav-inferior',
  templateUrl: './nav-inferior.component.html',
  styleUrls: ['./nav-inferior.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class NavInferiorComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
