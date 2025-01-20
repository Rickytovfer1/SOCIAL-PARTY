import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {RegistroUsuarioComponent} from "./registro-usuario/registro-usuario.component";
import {RegistroEmpresaComponent} from "./registro-empresa/registro-empresa.component";
import {LoginComponent} from "./login/login.component";
import {NavSuperiorComponent} from "./nav-superior/nav-superior.component";
import {NavInferiorComponent} from "./nav-inferior/nav-inferior.component";
import {PerfilComponent} from "./perfil/perfil.component";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, RegistroUsuarioComponent, RegistroEmpresaComponent, LoginComponent, NavSuperiorComponent, NavInferiorComponent, PerfilComponent],
})
export class AppComponent {
  constructor() {}
}
