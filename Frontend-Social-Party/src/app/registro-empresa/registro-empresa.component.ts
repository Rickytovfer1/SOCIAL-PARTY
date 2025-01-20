import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-registro-empresa',
  templateUrl: './registro-empresa.component.html',
  styleUrls: ['./registro-empresa.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class RegistroEmpresaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
