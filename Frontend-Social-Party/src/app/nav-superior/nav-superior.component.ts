import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-superior',
  templateUrl: './nav-superior.component.html',
  styleUrls: ['./nav-superior.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class NavSuperiorComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  irPerfil() {
      this.router.navigate(['/perfil']);
  }

  irEntradas() {
      this.router.navigate(['/ver-empresas']);
  }

  irAmigos() {
      this.router.navigate(['/amigos']);
  }

  irUbicacion() {
      this.router.navigate(['/asistentes-evento']);
  }

  irPublicaciones() {
      this.router.navigate(['/publicaciones']);
  }

  cerrarSesion() {
      const token = "";
      sessionStorage.setItem("authToken", token);
      this.router.navigate(['/login']);
  }
}
