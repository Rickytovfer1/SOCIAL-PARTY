import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-registro-empresa',
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLinkActive
  ]
})
export class RegistroEmpresaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
