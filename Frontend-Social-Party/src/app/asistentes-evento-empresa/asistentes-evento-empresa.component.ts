import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavSuperiorEmpresaComponent } from "../nav-superior-empresa/nav-superior-empresa.component";
import { NavInferiorEmpresaComponent } from "../nav-inferior-empresa/nav-inferior-empresa.component";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
import { TokenDataDTO } from "../modelos/TokenDataDTO";
import { environment } from "../../environments/environment";
import { Usuario } from "../modelos/Usuario";
import { Cliente } from "../modelos/Cliente";
import { Evento } from "../modelos/Evento";
import { Empresa } from "../modelos/Empresa";
import { UsuarioService } from "../servicios/usuario.service";
import { ClienteService } from "../servicios/cliente.service";
import { AmigoService } from "../servicios/amigo.service";
import { EventoService } from "../servicios/evento.service";
import { PerfilEmpresa } from "../modelos/PerfilEmpresa";
import { PerfilServicio } from "../servicios/perfil.service";
import { EmpresaService } from "../servicios/empresa.service";
import { NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { Perfil } from "../modelos/Perfil";
import {FormsModule} from "@angular/forms";

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
        NgIf,
        NgOptimizedImage,
        FormsModule
    ]
})
export class AsistentesEventoEmpresaComponent implements OnInit {

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
    showRangeFilter: boolean = false;
    valoracionRange = { lower: 0, upper: 1000 };

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
                this.asistentesFiltrados = [...this.asistentes];
                if (this.asistentes.length === 0) {
                    console.log("No hay asistentes para este evento.");
                }
            },
            error: err => {
                console.error("Error al cargar asistentes:", err);
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

    verPerfil(idCliente: number) {
        this.router.navigate(["/perfil-asistente-empresa", idCliente])
    }

    irCanjearEntrada() {
        this.router.navigate(['/canjear-entrada-empresa'])
    }

    onSearchChange(event: any) {
        const searchTerm = (event.target.value || '').toLowerCase();
        this.asistentesFiltrados = this.asistentes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(searchTerm)
        );
        this.applyValoracionRangeFilter();
    }

    sortByValoracionAsc() {
        this.asistentesFiltrados.sort((a, b) => a.valoracion - b.valoracion);
    }

    sortByValoracionDesc() {
        this.asistentesFiltrados.sort((a, b) => b.valoracion - a.valoracion);
    }

    toggleRangeFilter() {
        this.showRangeFilter = !this.showRangeFilter;
    }

    filterByRange() {
        this.asistentesFiltrados = this.asistentes.filter(cliente => {
            const matchesSearch = cliente.nombre.toLowerCase().includes((this.buscar || '').toLowerCase());
            const inRange = cliente.valoracion >= this.valoracionRange.lower && cliente.valoracion <= this.valoracionRange.upper;
            return matchesSearch && inRange;
        });
    }

    applyValoracionRangeFilter() {
        this.asistentesFiltrados = this.asistentesFiltrados.filter(cliente =>
            cliente.valoracion >= this.valoracionRange.lower && cliente.valoracion <= this.valoracionRange.upper
        );
    }
}
