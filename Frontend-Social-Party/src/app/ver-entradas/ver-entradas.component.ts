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
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Empresa} from "../modelos/Empresa";
import {FormsModule} from "@angular/forms";
import {environment} from "../../environments/environment";
import {EmpresaEntradaDTO} from "../modelos/EmpresaEntradaDTO";
import jsPDF from "jspdf";
import {NavLateralComponent} from "../nav-lateral/nav-lateral.component";
import {AmigosComponent} from "../amigos/amigos.component";

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
        NgOptimizedImage,
        NgIf,
        NavLateralComponent,
        AmigosComponent
    ]
})
export class VerEntradasComponent implements OnInit {
    empresaEntrada: EmpresaEntradaDTO = {} as Empresa;
    empresa: Empresa = {} as Empresa;
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
                private eventoService: EventoService) {
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
        this.entradaService.verEntradasActivas(id).subscribe({
            next: (entrada: Entrada[]) => {
                this.entradas = entrada;
            },
            error: (e) => {
                console.error("Error", e);
            },
            complete: () => console.info(this.entradas)
        });
    }

    cargarPerfil(idUsuario: number | undefined): void {
        this.perfilService.getPerfil(idUsuario).subscribe({
            next: (perfil: Perfil) => {
                this.perfil = perfil;
                this.verEntradas(this.perfil.id);
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
                this.verEmpresa(this.evento.idEmpresa);
                console.log(this.evento);
            },
            error: (e) => {
                console.error("Error al cargar el evento:", e);
            }
        });
    }

    verEmpresa(idEmpresa: number | undefined): void {
        this.eventoService.verEmpresa(idEmpresa).subscribe({
            next: (empresa: Empresa) => {
                this.empresa = empresa;
            },
            error: (e) => {
                console.error("Error al cargar la empresa:", e);
            }
        });
    }

    getImageUrl(empresaEntradaDTO: EmpresaEntradaDTO): string {
        if (!empresaEntradaDTO.fotoPerfil) {
            return 'assets/iconoPerfil.png';
        }
        if (empresaEntradaDTO.fotoPerfil.startsWith('http')) {
            return empresaEntradaDTO.fotoPerfil;
        } else {
            return `${this.baseUrl}${empresaEntradaDTO.fotoPerfil}`;
        }
    }

    downloadPDF(entrada: Entrada): void {
        this.entradaService.getEntradaById(entrada.id).subscribe({
            next: (fullEntrada: Entrada) => {
                const evento: any = fullEntrada.evento;
                const empresa: any = evento.empresa;

                const fechaCompra = new Date().toLocaleDateString('en-US');

                let fechaEventoFormateada = "N/A";
                if (evento.fecha) {
                    const d = new Date(evento.fecha);
                    if (!isNaN(d.getTime())) {
                        fechaEventoFormateada = d.toLocaleDateString('en-US');
                    }
                }

                const doc = new jsPDF();
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();

                doc.setFillColor(211, 229, 229);
                doc.rect(0, 0, pageWidth, pageHeight, 'F');

                const margin = 10;
                const ticketWidth = pageWidth - margin * 2;
                const ticketHeight = pageHeight - margin * 2;

                doc.setLineWidth(1);
                doc.setDrawColor(0, 0, 0);
                doc.roundedRect(margin, margin, ticketWidth, ticketHeight, 5, 5, 'S');

                const headerHeight = 30;
                doc.setFillColor(0, 102, 204);
                doc.rect(margin, margin, ticketWidth, headerHeight, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(18);
                doc.text("Entrada Confirmada", margin + 5, margin + 20);

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(12);
                const startY = margin + headerHeight + 10;
                const leftX = margin + 10;
                const rightX = margin + ticketWidth - 60;

                doc.text("Fecha de compra: " + fechaCompra, leftX, startY);
                doc.text("Fecha del evento: " + fechaEventoFormateada, leftX, startY + 10);
                doc.text("Hora de Apertura: " + (evento.horaApertura || "N/A"), leftX, startY + 20);
                doc.text("Hora de Finalización: " + (evento.horaFinalizacion || "N/A"), leftX, startY + 30);
                doc.text("Precio: " + (evento.precio || "N/A") + "€", leftX, startY + 40);
                doc.text("Discoteca: " + (empresa?.nombre || "N/A"), leftX, startY + 50);
                doc.text("Dirección: " + (empresa?.direccion || "N/A"), leftX, startY + 60);

                doc.text("Cliente: " + (this.perfil.nombre || '') + " " + (this.perfil.apellidos || ''), leftX, startY + 70);
                doc.text("Correo: " + (this.perfil.correo || this.usuario.correo || ''), leftX, startY + 80);
                doc.text("DNI: " + (this.perfil.dni || ''), leftX, startY + 90);

                doc.setFontSize(14);
                doc.text("Código de Entrada: " + fullEntrada.codigoEntrada, leftX, startY + 100);

                const qrCodeBase64 = (fullEntrada as any).qrCodeBase64;
                if (qrCodeBase64) {
                    const imgData = "data:image/png;base64," + qrCodeBase64;
                    const qrSize = 50;
                    doc.addImage(imgData, 'PNG', rightX, startY, qrSize, qrSize);
                }

                doc.setLineWidth(0.5);
                doc.setDrawColor(150, 150, 150);
                doc.setLineDashPattern([3, 3], 0);
                doc.line(margin, margin + headerHeight + 5, margin + ticketWidth, margin + headerHeight + 5);
                doc.setLineDashPattern([3, 3], 0);

                doc.save("entrada_" + fullEntrada.codigoEntrada + ".pdf");
            },
            error: (error) => {
                console.error("Error retrieving full entrada details", error);
            }
        });
    }



}
