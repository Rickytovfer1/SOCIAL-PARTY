import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class AmigosComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
