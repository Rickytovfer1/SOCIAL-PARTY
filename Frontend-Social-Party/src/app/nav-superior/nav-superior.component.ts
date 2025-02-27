import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {Usuario} from "../modelos/Usuario";
import {Cliente} from "../modelos/Cliente";
import {UsuarioService} from "../servicios/usuario.service";
import {ClienteService} from "../servicios/cliente.service";
import {AmigoService} from "../servicios/amigo.service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";

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

    correo?: string;
    usuario: Usuario = {} as Usuario;
    perfil: Cliente = {} as Cliente;

    constructor(private usuarioService: UsuarioService,
                private clienteService: ClienteService,
                private router: Router) { }

    ngOnInit() {
        this.inicio()
    }

    inicio() {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode<{ tokenDataDTO: TokenDataDTO }>(token);
                const tokenDataDTO = decodedToken?.tokenDataDTO;
                if (tokenDataDTO && tokenDataDTO.correo) {
                    this.correo = tokenDataDTO.correo;
                    this.cargarUsuario(this.correo);
                }
            } catch (e) {
                console.error('Error al decodificar el token:', e);
            }
        }
    }

    cargarUsuario(correo: string | undefined): void {
        this.usuarioService.getUsuario(correo).subscribe({
            next: (usuario: Usuario) => {
                this.usuario = usuario;
                if (usuario && usuario.id) {
                    this.cargarPerfil(usuario.id);
                }
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    cargarPerfil(idUsuario: number): void {
        this.clienteService.getCliente(idUsuario).subscribe({
            next: (perfil: Cliente) => {
                this.perfil = perfil;
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

  cerrarSesion() {
      const token = "";
      sessionStorage.setItem("authToken", token);
      this.router.navigate(['/login']);
  }
}
