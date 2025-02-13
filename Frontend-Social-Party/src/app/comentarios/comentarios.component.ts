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
import {ClienteService} from "../servicios/cliente.service";

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
                private publicacionService: PublicacionService,
                private clienteService: ClienteService) { }

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
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            },
            complete: () => {
                if (this.usuario.id)
                this.cargarPerfil(this.usuario.id)
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
            },
            complete: () => this.cargarComentarios(this.idPublicacion)
        });
    }

    cargarComentarios(idPublicacion: number) {
        this.publicacionService.listarComentariosPublicacion(idPublicacion).subscribe({
            next: (data) => {
                this.comentarios = data.reverse();
            },
            error: e => {console.error("Error al cargar los comentarios:", e);
            }
        })
    }

    enviarMensaje() {

        const mensaje: ComentarioEnvio = {
            texto: this.nuevoComentario,
            id_cliente: this.perfil.id,
            id_publicacion: this.idPublicacion
        }

        this.comentarioService.enviarComentario(mensaje).subscribe({
            next: () => {console.log("Comentario enviado: ", mensaje);},
            error: (e) => {console.error("Error al enviar el mensaje:", mensaje);}
        })

        this.nuevoComentario = ""
    }

    calcularFecha(comentario: Comentario): string {
        if (!comentario.fecha) {
            return "";
        }

        const fechaActual = new Date();
        const fechaComentario = new Date(comentario.fecha);
        const milisegundos = fechaActual.getTime() - fechaComentario.getTime();

        const minutos = 1000 * 60;
        const horas   = minutos * 60;
        const dias    = horas * 24;
        const meses  = dias * 30;
        const anios   = dias * 365;

        if (milisegundos >= anios) {
            const years = Math.floor(milisegundos / anios);
            return `Hace ${years} ${years === 1 ? "año" : "años"}`;
        } else if (milisegundos >= meses) {
            const months = Math.floor(milisegundos / meses);
            return `Hace ${months} ${months === 1 ? "mes" : "meses"}`;
        } else if (milisegundos >= dias) {
            const days = Math.floor(milisegundos / dias);
            return `Hace ${days} ${days === 1 ? "día" : "días"}`;
        } else if (milisegundos >= horas) {
            const hours = Math.floor(milisegundos / horas);
            return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
        } else if (milisegundos >= minutos) {
            const minutes = Math.floor(milisegundos / minutos);
            return `Hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
        } else {
            return "Hace un momento";
        }
    }

}
