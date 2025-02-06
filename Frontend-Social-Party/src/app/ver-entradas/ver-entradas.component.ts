import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {Evento} from "../modelos/Evento";
import {Entrada} from "../modelos/Entrada";
import {EventoService} from "../servicios/evento.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EntradaService} from "../servicios/entrada.service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {Perfil} from "../modelos/Perfil";
import {Usuario} from "../modelos/Usuario";
import {PerfilServicio} from "../servicios/perfil.service";
import {UsuarioService} from "../servicios/usuario.service";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {EmpresaDTO} from "../modelos/EmpresaDTO";
import {FormsModule} from "@angular/forms";
import {environment} from "../../environments/environment";
import {EmpresaEntradaDTO} from "../modelos/EmpresaEntradaDTO";

@Component({
    selector: 'app-ver-entradas',
    templateUrl: './ver-entradas.component.html',
    styleUrls: ['./ver-entradas.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent,
        NgForOf,
        FormsModule,
        NgOptimizedImage
    ]
})
export class VerEntradasComponent implements OnInit {
    empresaEntrada: EmpresaEntradaDTO = {} as EmpresaDTO;
    empresa: EmpresaDTO = {} as EmpresaDTO;
    evento: Evento = {} as Evento;
    usuario: Usuario = {} as Usuario;
    perfil: Perfil = {} as Perfil;
    entradas: Entrada[] = [];
    correo?: string;
    baseUrl: string = environment.apiUrl;


    constructor(private entradaService: EntradaService,
                private activateRoute: ActivatedRoute,
                private router: Router,
                private perfilService: PerfilServicio,
                private usuarioService: UsuarioService,
                private eventoService: EventoService,) {
    }

    ngOnInit() {
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

    verEntradas(id: number): void {
        this.entradaService.verEntradas(id).subscribe({

            next: (entrada: Entrada[]) => {
                this.entradas = entrada;
            },
            error: (e) => {
                console.error("Error");
            },
            complete: () =>
                console.info(this.entradas)
        });
    }

    cargarPerfil(idUsuario: number | undefined): void {
        this.perfilService.getPerfil(idUsuario).subscribe({
            next: (perfil: Perfil) => {
                this.perfil = perfil;
                this.verEntradas(this.perfil.id)
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
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

    verEvento(idEvento: number): void {
        this.eventoService.verEvento(idEvento).subscribe({
            next: (eventos: Evento) => {
                this.evento = eventos;
                this.verEmpresa(this.evento.idEmpresa)
                console.log(this.evento)
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    verEmpresa(idEmpresa: number | undefined): void {
        this.eventoService.verEmpresa(idEmpresa).subscribe({
            next: (empresa: EmpresaDTO) => {
                this.empresa = empresa;
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    getImageUrl(empresaEntradaDTO: EmpresaEntradaDTO): string {
        if (!empresaEntradaDTO.fotoPerfil) {
            return 'assets/iconoPerfil.png'; // Imagen por defecto si no hay fotoPerfil
        }
        if (empresaEntradaDTO.fotoPerfil.startsWith('http')) {
            return empresaEntradaDTO.fotoPerfil;
        } else {
            return `${this.baseUrl}${empresaEntradaDTO.fotoPerfil}`;
        }
    }

}
