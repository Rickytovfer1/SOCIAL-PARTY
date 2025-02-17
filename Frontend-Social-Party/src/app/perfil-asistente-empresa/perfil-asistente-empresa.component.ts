import {Component, OnInit} from '@angular/core';
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";
import {NavInferiorEmpresaComponent} from "../nav-inferior-empresa/nav-inferior-empresa.component";
import {AlertController, IonicModule} from "@ionic/angular";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../servicios/admin.service";
import {environment} from "../../environments/environment";
import {Cliente} from "../modelos/Cliente";
import {EmpresaService} from "../servicios/empresa.service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {Usuario} from "../modelos/Usuario";
import {UsuarioService} from "../servicios/usuario.service";
import {PerfilEmpresa} from "../modelos/PerfilEmpresa";
import {PerfilServicio} from "../servicios/perfil.service";
import {RestarPuntos} from "../modelos/RestarPuntos";
import {FormsModule} from "@angular/forms";
import {NavLateralComponent} from "../nav-lateral/nav-lateral.component";
import {AmigosComponent} from "../amigos/amigos.component";

@Component({
    selector: 'app-perfil-asistente-empresa',
    templateUrl: './perfil-asistente-empresa.component.html',
    styleUrls: ['./perfil-asistente-empresa.component.scss'],
    standalone: true,
    imports: [
        NavSuperiorEmpresaComponent,
        NavInferiorEmpresaComponent,
        IonicModule,
        NgOptimizedImage,
        FormsModule,
        NavLateralComponent,
        AmigosComponent
    ]
})
export class PerfilAsistenteEmpresaComponent implements OnInit {
    baseUrl: string = environment.apiUrl;
    cliente: Cliente = {} as Cliente;
    idCliente!: number;
    idEmpresa!: number;
    usuario: Usuario = {} as Usuario;
    perfilEmpresa: PerfilEmpresa = {} as PerfilEmpresa;
    correo?: string;
    opcionSeleccionada: string = '';

    constructor(private activateRoute: ActivatedRoute,
                private perfilService: PerfilServicio,
                private alertController: AlertController,
                private router: Router,
                private empresaService: EmpresaService,
                private usuarioService: UsuarioService
    ) {
    }

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


        this.activateRoute.params.subscribe(params => {
            this.idCliente = Number(params['id']);
        });
        this.cargarCliente(this.idCliente)
    }

    private puntosPorFalta: { [key: string]: number } = {
        "reiteracion": 5,
        "suplantacion": 10,
        "agresion": 20
    };

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
        this.perfilService.getPerfilEmpresa(idUsuario).subscribe({
            next: (perfilEmpresa: PerfilEmpresa) => {
                this.perfilEmpresa = perfilEmpresa;
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    cargarCliente(idCliente: number): void {
        this.empresaService.verCliente(idCliente).subscribe({
            next: (cliente: Cliente) => {
                this.cliente = cliente;
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    getImageUrlCliente(clienteDTO: Cliente): string {
        if (!clienteDTO.fotoPerfil || clienteDTO.fotoPerfil.trim() === '') {
            return 'assets/iconoPerfil.png';
        } else if (clienteDTO.fotoPerfil.startsWith('http')) {
            return clienteDTO.fotoPerfil;
        } else {
            return `${this.baseUrl}${clienteDTO.fotoPerfil}`;
        }
    }

    async confirmarBanearCliente(idEmpresa: number) {
        const alert = await this.alertController.create({
            header: 'Confirmar banear cliente',
            message: '¿Estás seguro de que deseas banear esta cuenta?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        console.log('Eliminación cancelada');
                    }
                },
                {
                    text: 'Confirmar',
                    handler: () => {
                        this.banearCliente(this.idCliente, idEmpresa);
                    }
                }
            ]
        });

        await alert.present();
    }

    banearCliente(idCliente: number, idEmpresa: number): void {
        this.empresaService.banearCliente(idCliente, idEmpresa).subscribe({
            next: () => {
                console.log("Cliente exitosamente");
            },
            error: (e) => {
                console.error("Error al banear al usuario:", e);
            }
        });
    }

    restarEstrella(): void {
        if (!this.opcionSeleccionada) {
            console.warn("No se ha seleccionado una opción válida.");
            return;
        }

        const puntos = this.puntosPorFalta[this.opcionSeleccionada];

        const restarPuntos: RestarPuntos = {
            idCliente: this.cliente.id,
            puntos: puntos,
            idEmpresa: this.perfilEmpresa.id,
            motivo: this.opcionSeleccionada
        };

        this.empresaService.restarEstrellas(restarPuntos).subscribe({
            next: () => {
                console.log(`Se han restado ${puntos} estrellas por falta ${this.opcionSeleccionada}`);
                location.reload();
            },
            error: (e) => {
                console.error("Error al restar estrellas:", e);
            }
        });
    }

}
