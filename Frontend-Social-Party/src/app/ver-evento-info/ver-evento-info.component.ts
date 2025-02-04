import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {Router} from "@angular/router";

@Component({
    selector: 'app-ver-evento-info',
    templateUrl: './ver-evento-info.component.html',
    styleUrls: ['./ver-evento-info.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent
    ]
})
export class VerEventoInfoComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  comprarEntrada(idEvento: number) {
      this.router.navigate(["/confirmacion-pago", idEvento])
  }

}
