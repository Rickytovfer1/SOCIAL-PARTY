import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";

@Component({
    selector: 'app-ver-empresas',
    templateUrl: './ver-empresas.component.html',
    styleUrls: ['./ver-empresas.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        FormsModule,
        NavInferiorComponent
    ]
})
export class VerEmpresasComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  verEventosEmpresa() {
      this.router.navigate(['/ver-eventos']);
  }

}
