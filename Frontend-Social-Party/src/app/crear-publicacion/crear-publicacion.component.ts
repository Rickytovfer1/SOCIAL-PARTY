import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from "@ionic/angular";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { Router } from "@angular/router";
import { PublicacionService } from '../servicios/publicacion.service';
import { UsuarioService } from "../servicios/usuario.service";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenDataDTO } from "../modelos/TokenDataDTO";
import { Usuario } from "../modelos/Usuario";
import { jwtDecode } from "jwt-decode";
import {CrearPublicacionCliente} from "../modelos/CrearPublicacionCliente";
import {Cliente} from "../modelos/Cliente";
import {ClienteService} from "../servicios/cliente.service";
import {EventoService} from "../servicios/evento.service";
import {EmpresaService} from "../servicios/empresa.service";
import {Evento} from "../modelos/Evento";
import {Empresa} from "../modelos/Empresa";
import {list} from "ionicons/icons";
import {NavLateralComponent} from "../nav-lateral/nav-lateral.component";
import {AmigosComponent} from "../amigos/amigos.component";
@Component({
    selector: 'app-crear-publicacion',
    templateUrl: './crear-publicacion.component.html',
    styleUrls: ['./crear-publicacion.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent,
        CommonModule,
        FormsModule,
        NavLateralComponent,
        AmigosComponent
    ]
})
export class CrearPublicacionComponent implements OnInit {

    cliente: Cliente = {} as Cliente;

    publicacion: CrearPublicacionCliente = {
        nombre: "",
        apellidos: "",
        texto: "",
        foto: undefined,
        lugar: "",
        idUsuario: 0
    }

    lista_eventos: Evento[] = [];
    lista_empresas: Empresa[] = [];

    constructor(
        private router: Router,
        private publicacionService: PublicacionService,
        private usuarioService: UsuarioService,
        private clienteService: ClienteService,
        private eventoService: EventoService,
        private empresaService: EmpresaService
    ) { }

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
                    this.cargarUsuario(tokenDataDTO.correo)
                    this.cargarEmpresasEventos()
                }
            } catch (e) {
                console.error('Error al decodificar el token:', e);
            }
        }
    }

    cargarUsuario(correo: string): void {
        this.usuarioService.getUsuario(correo).subscribe({
            next: (usuario: Usuario) => {
                if (usuario.id !== undefined) {
                    this.publicacion.idUsuario = usuario.id;
                    this.cargarCliente(usuario.id)
                } else {
                    console.log('Error', 'El usuario no tiene un ID válido.');
                }
            },
            error: () => {
                console.log('Error', 'No se pudo cargar el usuario.');
            }
        });
    }

    cargarCliente(idUsuario: number | undefined): void {
        this.clienteService.getCliente(idUsuario).subscribe({
            next: (cliente: Cliente) => {
                this.cliente = cliente;
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    cargarEmpresasEventos() {
        this.lista_empresas = []
        this.lista_eventos = []
        this.empresaService.listarEmpresas().subscribe({
            next: (data)=> {
                this.lista_empresas = data
                for (const empresa of this.lista_empresas) {
                    this.eventoService.getEventos(empresa.id).subscribe({
                        next: (data)=> {
                            for (const evento of data) {
                                this.lista_eventos.push(evento);
                            }
                        },
                        error: e => console.log("Error al cargar los eventos.")
                    })
                }
            },
            error: e => console.log("Error al cargar las empresas y sus eventos.")
        })
    }

    seleccionarFoto(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            this.publicacion.foto = event.target.files[0];
        }
    }

    publicar() {

        this.publicacion.nombre = this.cliente.nombre
        this.publicacion.apellidos = this.cliente.apellidos

        if (!this.publicacion.texto) {
            const toast = document.getElementById("toastCompleta") as any;
            toast.present();
            return
        }
        if (!this.publicacion.idUsuario) {
            console.log("Falta id usuario")
            return
        }
        if (!this.publicacion.foto) {
            const toast = document.getElementById("toastCompleta") as any;
            toast.present();
            return
        }

        for (const evento of this.lista_eventos) {
            if (evento.id === this.cliente.evento) {
                for (const empresa of this.lista_empresas) {
                    if (empresa.id === evento.idEmpresa) {
                        this.publicacion.lugar = empresa.nombre
                        break
                    }
                }
                break
            }
        }

        if (!this.publicacion.lugar) {
            const toast = document.getElementById("toastSinEvento") as any;
            toast.present();
            console.log("Falta el lugar")
            return
        }

        this.publicacionService.crearPublicacionCliente(this.publicacion).subscribe({
            next: () => {
                console.log('Éxito', 'Publicación creada exitosamente.');
                this.router.navigate(['/publicaciones']);
            },
            error: e => {
                console.log('Error', 'Error al crear publicación.');
            }
        })
    }

    ionViewWillEnter() {
        this.inicio()
    }
}
