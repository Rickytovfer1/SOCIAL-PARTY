import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { IonContent, ActionSheetController, AlertController, IonicModule } from '@ionic/angular';
import { DatePipe, CommonModule } from '@angular/common';
import { NavSuperiorComponent } from '../nav-superior/nav-superior.component';
import { MensajeDTO } from '../modelos/MensajeDTO';
import { Usuario } from '../modelos/Usuario';
import { MensajeService } from '../servicios/mensaje.service';
import { UsuarioService } from '../servicios/usuario.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Perfil } from '../modelos/Perfil';
import { PerfilServicio } from '../servicios/perfil.service';
import { SocketService } from '../servicios/SocketService';
import { jwtDecode } from 'jwt-decode';
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, NavSuperiorComponent, IonicModule, NavInferiorComponent],
    providers: [DatePipe]
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
    @ViewChild('scrollContent') private scrollContent!: ElementRef;
    @ViewChild(IonContent, { static: false }) content!: IonContent;
    usuario: Usuario = { id: 0, correo: '' };
    mensajes: MensajeDTO[] = [];
    gruposMensajes: { fecha: string; mensajes: MensajeDTO[] }[] = [];
    nuevoTexto = '';
    idReceptor = 0;
    perfil: Perfil = {} as Perfil;
    private needScroll = false;
    private socketSubscription: Subscription = new Subscription();

    constructor(
        private mensajeService: MensajeService,
        private usuarioService: UsuarioService,
        private route: ActivatedRoute,
        private router: Router,
        private perfilService: PerfilServicio,
        private datePipe: DatePipe,
        private actionSheetController: ActionSheetController,
        private alertController: AlertController,
        private socketService: SocketService
    ) {}

    ngOnInit() {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            this.router.navigate(['/login']);
            return;
        }
        let decoded: any;
        try {
            decoded = jwtDecode(token);
        } catch {
            this.router.navigate(['/login']);
            return;
        }
        const tokenData = decoded?.tokenDataDTO;
        if (!tokenData?.correo) {
            this.router.navigate(['/login']);
            return;
        }
        this.usuarioService.getUsuario(tokenData.correo)
            .pipe(switchMap((user: Usuario | undefined) => {
                if (!user || user.id === undefined) {
                    this.router.navigate(['/login']);
                    throw new Error('Usuario no encontrado');
                }
                this.usuario = user;
                return this.route.paramMap;
            }))
            .subscribe({
                next: (params) => {
                    const receptorIdStr = params.get('id');
                    const receptorId = receptorIdStr ? Number(receptorIdStr) : 0;
                    // @ts-ignore
                    if (receptorId > 0 && this.usuario.id > 0) {
                        this.idReceptor = receptorId;
                        this.cargarConversacion(this.usuario.id, this.idReceptor, true);
                        this.cargarPerfil(this.idReceptor);
                        this.socketService.subscribeToConversation(this.usuario.id, this.idReceptor);
                        this.socketSubscription = this.socketService.listenEvent().subscribe((data: any) => {
                            this.handleSocketEvent(data);
                        });
                    }
                },
                error: () => {}
            });
    }

    ngAfterViewChecked() {
        if (this.needScroll) {
            this.scrollToBottom();
            this.needScroll = false;
        }
    }

    handleSocketEvent(data: any) {
        const action = data.action;
        const mensajeData: MensajeDTO = data.mensaje;
        if (!action || !mensajeData) {
            return;
        }
        this.content.getScrollElement().then(el => {
            const oldScrollHeight = el.scrollHeight;
            const oldScrollTop = el.scrollTop;
            const oldClientHeight = el.clientHeight;
            const distanceFromBottom = oldScrollHeight - (oldScrollTop + oldClientHeight);
            if (action === 'create') {
                this.mensajes.push(mensajeData);
            } else if (action === 'update') {
                const index = this.mensajes.findIndex(m => m.id === mensajeData.id);
                if (index !== -1) {
                    this.mensajes[index].texto = mensajeData.texto;
                    this.mensajes[index].editado = mensajeData.editado;
                    this.mensajes[index].borrado = mensajeData.borrado;
                    this.mensajes[index].fecha = mensajeData.fecha;
                    this.mensajes[index].hora = mensajeData.hora;
                }
            } else if (action === 'delete') {
                const index = this.mensajes.findIndex(m => m.id === mensajeData.id);
                if (index !== -1) {
                    this.mensajes[index].borrado = true;
                }
            }
            this.agruparMensajesPorFecha();
            setTimeout(() => {
                const newScrollHeight = el.scrollHeight;
                const newClientHeight = el.clientHeight;
                const newScrollTop = newScrollHeight - newClientHeight - distanceFromBottom;
                this.content.scrollToPoint(0, newScrollTop, 0);
            }, 50);
        });
    }

    cargarConversacion(idEmisor?: number, idReceptor?: number, scroll: boolean = true, preserveScrollPosition?: number) {
        if (idEmisor === undefined || idReceptor === undefined) {
            return;
        }
        this.mensajeService.verConversacion(idEmisor, idReceptor).subscribe({
            next: mensajes => {
                mensajes.sort((a, b) => new Date(a.fecha!).getTime() - new Date(b.fecha!).getTime());
                this.mensajes = mensajes;
                this.agruparMensajesPorFecha();
                if (scroll) {
                    this.needScroll = true;
                } else if (preserveScrollPosition !== undefined) {
                    setTimeout(() => {
                        this.content.scrollToPoint(0, preserveScrollPosition, 0);
                    }, 100);
                }
            },
            error: () => {}
        });
    }

    enviar() {
        if (!this.nuevoTexto.trim()) {
            return;
        }
        if (!this.usuario.id || !this.idReceptor) {
            return;
        }
        const now = new Date();
        const mensaje: MensajeDTO = {
            texto: this.nuevoTexto.trim(),
            idEmisor: this.usuario.id,
            idReceptor: this.idReceptor,
            fecha: this.datePipe.transform(now, 'yyyy-MM-dd') || '',
            hora: this.datePipe.transform(now, 'HH:mm:ss') || ''
        };
        this.mensajeService.enviarMensaje(mensaje).subscribe({
            next: () => { this.nuevoTexto = ''; },
            error: () => {}
        });
    }

    cargarPerfil(idUsuario: number | undefined) {
        if (!idUsuario) return;
        this.perfilService.getPerfil(idUsuario).subscribe({
            next: (perfil: Perfil) => { this.perfil = perfil; },
            error: () => {}
        });
    }

    agruparMensajesPorFecha() {
        const grupos: { fecha: string; mensajes: MensajeDTO[] }[] = [];
        let grupoActual: { fecha: string; mensajes: MensajeDTO[] } | null = null;
        this.mensajes.forEach(m => {
            const fechaMensaje = new Date(m.fecha!);
            const hoy = new Date();
            const ayer = new Date();
            ayer.setDate(hoy.getDate() - 1);
            let fechaFormateada = this.getFormattedDate(m.fecha!);
            if (this.esMismoDia(fechaMensaje, hoy)) {
                fechaFormateada = 'Hoy';
            } else if (this.esMismoDia(fechaMensaje, ayer)) {
                fechaFormateada = 'Ayer';
            }
            if (!grupoActual || grupoActual.fecha !== fechaFormateada) {
                grupoActual = { fecha: fechaFormateada, mensajes: [] };
                grupos.push(grupoActual);
            }
            grupoActual.mensajes.push(m);
        });
        this.gruposMensajes = grupos;
    }

    esMismoDia(fecha1: Date, fecha2: Date): boolean {
        return fecha1.getDate() === fecha2.getDate() &&
            fecha1.getMonth() === fecha2.getMonth() &&
            fecha1.getFullYear() === fecha2.getFullYear();
    }

    getFormattedDate(fecha: string): string {
        const date = new Date(fecha);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return day + '/' + month;
    }

    scrollToBottom() {
        setTimeout(() => { this.content.scrollToBottom(300); }, 100);
    }

    async mostrarOpciones(mensaje: MensajeDTO) {
        const actionSheet = await this.actionSheetController.create({
            header: 'Opciones',
            buttons: [
                { text: 'Editar', handler: () => this.editarMensaje(mensaje) },
                { text: 'Eliminar', handler: () => this.eliminarMensaje(mensaje) },
                { text: 'Cancelar', role: 'cancel' }
            ]
        });
        await actionSheet.present();
    }

    async editarMensaje(mensaje: MensajeDTO) {
        const alert = await this.alertController.create({
            header: 'Editar Mensaje',
            inputs: [{ name: 'texto', type: 'text', value: mensaje.texto }],
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                { text: 'Guardar', handler: data => { if (data.texto.trim()) { this.mensajeService.editarMensaje(mensaje.id!, data.texto.trim()).subscribe({ next: () => {}, error: () => {} }); } } }
            ]
        });
        await alert.present();
    }

    async eliminarMensaje(mensaje: MensajeDTO) {
        const alert = await this.alertController.create({
            header: 'Eliminar Mensaje',
            message: '¿Estás seguro de que deseas eliminar este mensaje?',
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                { text: 'Eliminar', handler: () => { this.mensajeService.eliminarMensaje(mensaje.id!).subscribe({ next: () => {}, error: () => {} }); } }
            ]
        });
        await alert.present();
    }

    trackByGrupo(index: number, grupo: { fecha: string; mensajes: MensajeDTO[] }): string {
        return grupo.fecha;
    }

    trackByMensaje(index: number, mensaje: MensajeDTO): number | undefined {
        return mensaje.id;
    }

    ngOnDestroy() {
        this.socketSubscription.unsubscribe();
    }
}
