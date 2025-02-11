import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {Usuario} from "../modelos/Usuario";
import {Perfil} from "../modelos/Perfil";
import {UsuarioService} from "../servicios/usuario.service";
import {PerfilServicio} from "../servicios/perfil.service";
import {ActivatedRoute} from "@angular/router";
import {Comentario} from "../modelos/Comentario";
import {ComentarioService} from "../servicios/comentario.service";
import {PublicacionService} from "../servicios/publicacion.service";
import {NgForOf} from "@angular/common";
import {ComentarioEnvio} from "../modelos/ComentarioEnvio";
import {FormsModule} from "@angular/forms";
import {MostrarPublicacion} from "../modelos/MostrarPublicacion";

@Component({
    selector: 'app-comentarios',
    templateUrl: './comentarios.component.html',
    styleUrls: ['./comentarios.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent,
        NgForOf,
        FormsModule
    ]
})
export class ComentariosComponent  implements OnInit {

    correo: string = ""
    usuario: Usuario = {} as Usuario;
    perfil: Perfil = {} as Perfil;
    idPublicacion!: number;
    comentarios: Comentario[] = []
    perfilesComentarios: Perfil[] = [];
    nombresComentarios: {[key: number]: string} = {};
    nuevoComentario: string = ""

    constructor(private usuarioService: UsuarioService,
                private perfilService: PerfilServicio,
                private activateRoute: ActivatedRoute,
                private comentarioService: ComentarioService,
                private publicacionService: PublicacionService) { }

    ngOnInit() {
        this.inicio()
    }

    inicio() {
        this.activateRoute.params.subscribe(params => {
            this.idPublicacion = Number(params['id']);
        });

        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode<{ tokenDataDTO: TokenDataDTO }>(token);
                const tokenDataDTO = decodedToken?.tokenDataDTO;
                if (tokenDataDTO && tokenDataDTO.correo) {
                    this.correo = tokenDataDTO.correo;
                    this.cargarUsuario(this.correo);
                    this.cargarComentarios(this.idPublicacion)

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
        this.perfilService.getPerfil(idUsuario).subscribe({
            next: (perfil: Perfil) => {
                this.perfil = perfil;
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    cargarComentarios(idPublicacion: number) {
        this.publicacionService.listarComentariosPublicacion(idPublicacion).subscribe({
            next: (data) => {
                this.comentarios = data;
                for (const comentario of this.comentarios) {
                    this.perfilService.getPerfil(comentario.id_cliente).subscribe({
                        next: (data) => {
                            console.log(data)
                            this.perfilesComentarios.push(data);
                            if (data.nombre) {
                                this.nombresComentarios[data.id] = data.nombre;
                            }
                        }
                    })
                }
            },
            error: e => {console.error("Error al cargar los comentarios:", e);}
        })
    }

    cargarPerfiles() {

    }

    cargarNombresComentarios() {

    }

    enviarMensaje(texto_mensaje: string) {
        const mensaje: ComentarioEnvio = {
            texto: texto_mensaje,
            id_cliente: this.perfil.id,
            id_publicacion: this.idPublicacion
        }

        this.comentarioService.enviarComentario(mensaje).subscribe({
            next: () => {console.log("Comentario enviado: ", mensaje);},
            error: (e) => {console.error("Error al enviar el mensaje:", mensaje);}
        })
    }

    devolverIndice(comentario: Comentario): string {
        if (comentario.id_cliente) {
            return this.nombresComentarios[comentario.id_cliente];
        }
        return ""
    }

}
