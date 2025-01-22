import { Component } from '@angular/core';
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.component.html',
  styleUrls: ['./menu-principal.component.scss'],
  standalone: true,
  imports: [
    NavSuperiorComponent,
    NavInferiorComponent,
    IonicModule,
    CommonModule
  ]
})
export class MenuPrincipalComponent {

}
