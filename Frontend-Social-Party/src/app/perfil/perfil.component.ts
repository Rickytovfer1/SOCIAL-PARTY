import { Component, OnInit } from '@angular/core';
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [
    NavSuperiorComponent,
    NavInferiorComponent,
    IonicModule
  ]
})
export class PerfilComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  onPhotoSelected($event: any) {
    
  }
}
