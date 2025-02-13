import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";
import {NavInferiorEmpresaComponent} from "../nav-inferior-empresa/nav-inferior-empresa.component";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {environment} from "../../environments/environment";
import {Usuario} from "../modelos/Usuario";
import {Cliente} from "../modelos/Cliente";
import {Evento} from "../modelos/Evento";
import {Empresa} from "../modelos/Empresa";
import {UsuarioService} from "../servicios/usuario.service";
import {ClienteService} from "../servicios/cliente.service";
import {AmigoService} from "../servicios/amigo.service";
import {EventoService} from "../servicios/evento.service";
import {PerfilEmpresa} from "../modelos/PerfilEmpresa";
import {PerfilServicio} from "../servicios/perfil.service";
import {EmpresaService} from "../servicios/empresa.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'app-asistentes-evento-empresa',
    templateUrl: './asistentes-evento-empresa.component.html',
    styleUrls: ['./asistentes-evento-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorEmpresaComponent,
        NavInferiorEmpresaComponent,
        NavInferiorComponent,
        NavSuperiorComponent,
        NgForOf,
        NgIf
    ]
})
export class AsistentesEventoEmpresaComponent implements OnInit {

    baseUrl: string = environment.apiUrl;
    correo?: string;
    usuario: Usuario = {} as Usuario;
    perfil: Cliente = {} as Cliente;
    evento: Evento = {} as Evento;
    empresa: Empresa = {} as Empresa;
    asistentes: Cliente[]  = [];
    amigos: Cliente[]  = [];

    constructor(
        private router: Router,
        private usuarioService: UsuarioService,
        private empresaService: EmpresaService,
        private amigoService: AmigoService,
        private eventoService: EventoService
    ) {}

    ngOnInit() {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token) as { tokenDataDTO: TokenDataDTO };
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

    cargarUsuario(correo: string): void {
        this.usuarioService.getUsuarioEmpresa(correo).subscribe({
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
        this.empresaService.getPerfilEmpresa(idUsuario).subscribe({
            next: (empresa: Empresa) => {
                this.empresa = empresa;
                this.cargarEventoHoy(this.empresa.id)

            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    cargarEventoHoy(idEmpresa: number): void {
        this.empresaService.getEventoHoy(idEmpresa).subscribe({
            next: (evento: Evento) => {
                this.evento = evento;
                this.cargarAsistentes()

            },
            error: (e) => {
                console.error("Error al cargar el evento:", e);
            }
        });
    }

    cargarAsistentes() {
        if (!this.evento || !this.evento.id) {
            console.log("No se puede cargar asistentes porque no hay eventos actuale.");
            this.asistentes = [];
            return;
        }

        this.eventoService.verPersonasEventoEmpresa(this.evento.id).subscribe({
            next: data => {
                this.asistentes = data && data.length > 0 ? data : [];
                if (this.asistentes.length === 0) {
                    console.log("No hay asistentes para este evento.");
                }
            },
            error: err => {
                console.error("Error al cargar asistentes:", err);
            }
        });
    }


    verPerfil(cliente: Cliente) {
        this.router.navigate(["/perfil-asistente", cliente.idUsuario])
    }
    irCanjearEntrada(){
        this.router.navigate(['/canjear-entrada-empresa'])
    }
}
