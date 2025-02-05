import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorEmpresaComponent} from "../nav-inferior-empresa/nav-inferior-empresa.component";
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";
import {EntradaService} from "../servicios/entrada.service";
import {RegistroEmpresa} from "../modelos/RegistroEmpresa";
import {Entrada} from "../modelos/Entrada";
import {ActivatedRoute, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {EventoService} from "../servicios/evento.service";
import {Evento} from "../modelos/Evento";
import {EmpresaDTO} from "../modelos/EmpresaDTO";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {Perfil} from "../modelos/Perfil";
import {Usuario} from "../modelos/Usuario";
import {PerfilServicio} from "../servicios/perfil.service";
import {UsuarioService} from "../servicios/usuario.service";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";

@Component({
    selector: 'app-confirmacion-pago',
    templateUrl: './confirmacion-pago.component.html',
    styleUrls: ['./confirmacion-pago.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule,
        NavInferiorComponent,
        NavSuperiorComponent
    ]
})
export class ConfirmacionPagoComponent implements OnInit {
    evento: Evento = {} as Evento;
    empresa: EmpresaDTO = {} as EmpresaDTO;
    id!: number;
    idEmpresa!: number;
    usuario: Usuario = {} as Usuario;
    perfil: Perfil = {} as Perfil;
    correo?: string;

    entrada: Entrada = {} as Entrada

    constructor(private entradaService: EntradaService,
                private activateRoute: ActivatedRoute,
                private router: Router,
                private eventoService: EventoService,
                private perfilService: PerfilServicio,
                private usuarioService: UsuarioService) {
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

        this.activateRoute.params.subscribe(params => {
            this.id = Number(params['id']);
        });
        this.verEvento(this.id)
    }

    comprarEntrada(): void {
        this.entradaService.comprarEntrada(this.id, this.empresa.id, this.perfil.id).subscribe({
            next: (entradaComprada) => {
                //this.router.navigate([`/app-grupos/${id}`])
                console.log('Entrada comprada:');
            },
            error: (error) => {
                console.error('Error al comprar la entrada:', error);
            }
        })

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

    cargarPerfil(idUsuario: number | undefined): void {
        this.perfilService.getPerfil(idUsuario).subscribe({
            next: (perfil: Perfil) => {
                this.perfil = perfil;

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
                console.log(this.usuario)
                if (usuario && usuario.id) {
                    this.cargarPerfil(usuario.id);
                }
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

}
