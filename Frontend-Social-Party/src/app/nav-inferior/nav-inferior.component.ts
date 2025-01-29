import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-inferior',
  templateUrl: './nav-inferior.component.html',
  styleUrls: ['./nav-inferior.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class NavInferiorComponent  implements OnInit {

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
}
