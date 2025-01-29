import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {Router} from "@angular/router";
import {routes} from "../app.routes";

@Component({
    selector: 'app-publicaciones',
    templateUrl: './publicaciones.component.html',
    styleUrls: ['./publicaciones.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent
    ]
})
export class PublicacionesComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  abrirForm() {
      this.router.navigate(["/crear-publicacion"])
  }

}
