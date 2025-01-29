import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {Usuario} from "../modelos/Usuario";
import {Perfil} from "../modelos/Perfil";
import {PerfilEmpresa} from "../modelos/PerfilEmpresa";
import {PerfilServicio} from "../servicios/perfil.service";
import {ActivatedRoute} from "@angular/router";
import {UsuarioService} from "../servicios/usuario.service";
import {ClienteService} from "../servicios/cliente.service";
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";
import {NavInferiorEmpresaComponent} from "../nav-inferior-empresa/nav-inferior-empresa.component";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";

@Component({
    selector: 'app-perfil-empresa',
    templateUrl: './perfil-empresa.component.html',
    styleUrls: ['./perfil-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent,
        NavSuperiorEmpresaComponent,
        NavInferiorEmpresaComponent
    ]
})
export class PerfilEmpresaComponent implements OnInit {


    usuario: Usuario = {} as Usuario;
    perfilEmpresa: PerfilEmpresa = {} as PerfilEmpresa;
    correo?: string;
    editar: boolean = false;

    constructor(private perfilService: PerfilServicio,
                private activateRoute: ActivatedRoute,
                private usuarioService: UsuarioService,) {
    }

    ngOnInit() {
        const token = sessionStorage.getItem('authToken');
        console.log('Auth Token:', token);

        if (token) {
            try {
                const decodedToken = jwtDecode(token) as { tokenDataDTO: TokenDataDTO };
                console.log('Decoded Token:', decodedToken);

                const tokenDataDTO = decodedToken?.tokenDataDTO;

                if (tokenDataDTO && tokenDataDTO.correo) {
                    this.correo = tokenDataDTO.correo;
                    console.log('Correo obtenido del token:', this.correo);

                    this.cargarUsuario(this.correo);
                } else {
                    console.error('El token no contiene un correo válido en tokenDataDTO');
                }
            } catch (e) {
                console.error('Error al decodificar el token:', e);
            }
        } else {
            console.warn('No se encontró el token de autenticación en sessionStorage');
        }
    }

    cargarPerfil(idUsuario: number): void {
        this.perfilService.getPerfilEmpresa(idUsuario).subscribe({
            next: (perfilEmpresa: PerfilEmpresa) => {
                this.perfilEmpresa = perfilEmpresa;
                console.log('Perfil de la empresa cargado:', this.perfilEmpresa);
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    cargarUsuario(correo: string): void {
        this.usuarioService.getUsuarioEmpresa(correo).subscribe({
            next: (usuario: Usuario) => {
                this.usuario = usuario;
                console.log('Usuario cargado:', this.usuario);

                if (usuario && usuario.id) {
                    this.cargarPerfil(usuario.id);
                } else {
                    console.error('El usuario no tiene un ID válido.');
                }
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    editarBoton(): void {
        if (this.editar) {
            this.editar = false;
        } else {
            this.editar = true;
        }
    }
}
