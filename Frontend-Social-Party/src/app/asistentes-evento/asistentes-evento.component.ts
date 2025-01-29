import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {Router} from "@angular/router";

@Component({
    selector: 'app-asistentes-evento',
    templateUrl: './asistentes-evento.component.html',
    styleUrls: ['./asistentes-evento.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent
    ]
})
export class AsistentesEventoComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  verPerfil() {
      this.router.navigate(["/perfil-asistente"])
  }
}
