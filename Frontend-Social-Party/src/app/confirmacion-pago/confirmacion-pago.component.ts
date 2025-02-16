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
import {Empresa} from "../modelos/Empresa";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {Perfil} from "../modelos/Perfil";
import {Usuario} from "../modelos/Usuario";
import {PerfilServicio} from "../servicios/perfil.service";
import {UsuarioService} from "../servicios/usuario.service";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import jsPDF from "jspdf";
import {NavLateralComponent} from "../nav-lateral/nav-lateral.component";
import {AmigosComponent} from "../amigos/amigos.component";

@Component({
    selector: 'app-confirmacion-pago',
    templateUrl: './confirmacion-pago.component.html',
    styleUrls: ['./confirmacion-pago.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule,
        NavInferiorComponent,
        NavSuperiorComponent,
        NavLateralComponent,
        AmigosComponent
    ]
})
export class ConfirmacionPagoComponent implements OnInit {
    evento: Evento = {} as Evento;
    empresa: Empresa = {} as Empresa;
    id!: number;
    idEmpresa!: number;
    usuario: Usuario = {} as Usuario;
    perfil: Perfil = {} as Perfil;
    correo?: string;
    qrCodeBase64: string = "";
    entrada: Entrada = {} as Entrada

    num_tarjeta: string = "";
    fech_tarjeta: string  = "";
    ccv_tarjeta: string  = "";

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

        if (!this.num_tarjeta || !this.fech_tarjeta || !this.ccv_tarjeta) {
            const toast = document.getElementById("toastCampos") as any;
            toast.present();
            return
        }
        this.entradaService.comprarEntrada(this.id, this.empresa.id, this.usuario.id).subscribe({
            next: (entradaComprada: any) => {
                console.log('Entrada comprada:', entradaComprada);
                this.qrCodeBase64 = entradaComprada.qrCodeBase64;
                this.entrada.codigoEntrada = entradaComprada.codigoEntrada;
                this.generatePDF();
                this.router.navigate(["/ver-empresas"]);
            },
            error: (error) => {
                console.error('Error al comprar la entrada:', error);
            }
        });
    }


    generatePDF(): void {
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

        doc.text("Fecha de compra: " + new Date().toLocaleDateString(), leftX, startY);
        doc.text("Fecha del evento: " + this.evento.fecha, leftX, startY + 10);
        doc.text("Hora de Apertura: " + this.evento.horaApertura, leftX, startY + 20);
        doc.text("Hora de Finalización: " + this.evento.horaFinalizacion, leftX, startY + 30);
        doc.text("Precio: " + this.evento.precio + "€", leftX, startY + 40);
        doc.text("Discoteca: " + this.empresa.nombre, leftX, startY + 50);
        doc.text("Dirección: " + this.empresa.direccion, leftX, startY + 60);

        doc.text("Cliente: " + (this.perfil.nombre || '') + " " + (this.perfil.apellidos || ''), leftX, startY + 70);
        doc.text("Correo: " + (this.perfil.correo || ''), leftX, startY + 80);
        doc.text("DNI: " + (this.perfil.dni || ''), leftX, startY + 90);

        doc.setFontSize(14);
        doc.text("Código de Entrada: " + this.entrada.codigoEntrada, leftX, startY + 100);

        const qrX = rightX;
        const qrY = startY;
        const qrSize = 50;
        const imgData = "data:image/png;base64," + this.qrCodeBase64;
        doc.addImage(imgData, 'PNG', qrX, qrY, qrSize, qrSize);

        doc.setLineWidth(0.5);
        doc.setDrawColor(150, 150, 150);
        doc.setLineDashPattern([3, 3], 0);
        doc.line(margin, margin + headerHeight + 5, margin + ticketWidth, margin + headerHeight + 5);
        doc.setLineDashPattern([3, 3], 0);

        doc.save("entrada.pdf");
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
            next: (empresa: Empresa) => {
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
                if (!perfil.correo && this.usuario.correo) {
                    perfil.correo = this.usuario.correo;
                }
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
