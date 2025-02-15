import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { Router } from "@angular/router";
import { PublicacionService } from "../servicios/publicacion.service";
import { UsuarioService } from "../servicios/usuario.service";
import { PerfilServicio } from "../servicios/perfil.service";
import { AmigoService } from "../servicios/amigo.service";
import { FavoritoService } from "../servicios/favorito.service";
import { jwtDecode } from "jwt-decode";
import { TokenDataDTO } from "../modelos/TokenDataDTO";
import { Usuario } from "../modelos/Usuario";
import { Perfil } from "../modelos/Perfil";
import { environment } from "../../environments/environment";
import { EventoService } from "../servicios/evento.service";
import { ClienteService } from "../servicios/cliente.service";
import { Cliente } from "../modelos/Cliente";
import { Evento } from "../modelos/Evento";
import { Empresa } from "../modelos/Empresa";
import { NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-asistentes-evento',
    templateUrl: './asistentes-evento.component.html',
    styleUrls: ['./asistentes-evento.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent,
        NgForOf,
        NgIf,
        NgOptimizedImage,
        FormsModule
    ]
})
export class AsistentesEventoComponent implements OnInit {

    baseUrl: string = environment.apiUrl;
    correo?: string;
    usuario: Usuario = {} as Usuario;
    perfil: Cliente = {} as Cliente;
    evento: Evento = {} as Evento;
    empresa: Empresa = {} as Empresa;
    asistentes: Cliente[] = [];
    asistentesFiltrados: Cliente[] = [];
    amigos: Cliente[] = [];

    buscar: string = '';
    valoracionRange: { lower: number, upper: number } = { lower: 0, upper: 1000 };
    showRangeFilter: boolean = false;

    constructor(
        private router: Router,
        private usuarioService: UsuarioService,
        private clienteService: ClienteService,
        private amigoService: AmigoService,
        private eventoService: EventoService
    ) {}

    ngOnInit() {
        this.inicio();
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
                this.cargarEvento();
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    cargarEvento() {
        this.eventoService.verEvento(this.perfil.evento).subscribe({
            next: (data) => {
                this.evento = data;
                this.cargarEmpresaEvento();
            }
        });
    }

    cargarEmpresaEvento() {
        this.eventoService.verEmpresa(this.evento.idEmpresa).subscribe({
            next: data => {
                this.empresa = data;
                this.cargarAsistentes();
            }
        });
    }

    cargarAsistentes() {
        this.eventoService.verPersonasEvento(this.evento.id).subscribe({
            next: data => {
                this.asistentes = data;
                this.asistentesFiltrados = data;
                this.cargarAmigos();
            }
        });
    }

    cargarAmigos() {
        this.amigoService.getAmigos(this.perfil.idUsuario).subscribe({
            next: data => {
                this.amigos = data;
                console.log("Amigos cargados: ", this.amigos);
            },
            error: (e) => { console.error("Error al cargar los amigos:", e); }
        });
    }

    esAmigo(cliente: Cliente): boolean {
        let encontrado = false;
        for (const amigo of this.amigos) {
            if (amigo.id === cliente.id) {
                encontrado = true;
                break;
            }
        }
        if (cliente.nombre === this.perfil.nombre) {
            encontrado = true;
        }
        return encontrado;
    }

    verPerfil(cliente: Cliente) {
        this.router.navigate(["/perfil-asistente", cliente.idUsuario]);
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


    aplicarFiltros() {
        this.asistentesFiltrados = this.asistentes.filter(cliente => {
            const matchesSearch = !this.buscar ||
                cliente.nombre.toLowerCase().includes(this.buscar.toLowerCase());
            const matchesRange = !this.showRangeFilter ||
                (cliente.valoracion >= this.valoracionRange.lower &&
                    cliente.valoracion <= this.valoracionRange.upper);
            return matchesSearch && matchesRange;
        });
    }

    onSearchChange(event: any) {
        this.buscar = event.target.value;
        this.aplicarFiltros();
    }

    sortByValoracionAsc() {
        this.asistentesFiltrados.sort((a, b) => a.valoracion - b.valoracion);
    }

    sortByValoracionDesc() {
        this.asistentesFiltrados.sort((a, b) => b.valoracion - a.valoracion);
    }

    toggleRangeFilter() {
        this.showRangeFilter = !this.showRangeFilter;
        this.aplicarFiltros();
    }

    filterByRange() {
        this.aplicarFiltros();
    }
}
