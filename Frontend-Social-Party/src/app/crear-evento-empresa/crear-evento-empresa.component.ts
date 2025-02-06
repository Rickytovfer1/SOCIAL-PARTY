import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavSuperiorEmpresaComponent } from '../nav-superior-empresa/nav-superior-empresa.component';
import { NavInferiorEmpresaComponent } from '../nav-inferior-empresa/nav-inferior-empresa.component';
import { EventoService } from '../servicios/evento.service';
import { UsuarioService } from '../servicios/usuario.service';
import { jwtDecode } from 'jwt-decode';
import { TokenDataDTO } from '../modelos/TokenDataDTO';

@Component({
    selector: 'app-crear-evento-empresa',
    templateUrl: './crear-evento-empresa.component.html',
    styleUrls: ['./crear-evento-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        NavSuperiorEmpresaComponent,
        NavInferiorEmpresaComponent
    ]
})
export class CrearEventoEmpresaComponent implements OnInit {
    titulo: string = '';
    descripcion: string = '';
    fecha: string = '';
    horaApertura: string = '';
    horaFinalizacion: string = '';
    precio: number = 0;
    empresaId?: number;
    correo?: string;
    foto: File | null = null;

    constructor(
        private eventoService: EventoService,
        private usuarioService: UsuarioService,
        private alertController: AlertController,
        private router: Router
    ) {}

    ngOnInit() {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode<{ tokenDataDTO: TokenDataDTO }>(token);
                const correo = decodedToken.tokenDataDTO.correo;
                if (correo) {
                    this.correo = correo;
                    this.cargarEmpresa(correo);
                } else {
                    this.presentAlert('Error', 'Correo no encontrado en el token.');
                }
            } catch (e) {
                this.presentAlert('Error', 'Token inválido.');
            }
        } else {
            this.presentAlert('Error', 'No se encontró el token de autenticación.');
        }
    }

    cargarEmpresa(correo: string): void {
        this.usuarioService.getUsuarioEmpresa(correo).subscribe({
            next: (usuario) => {
                if (usuario.id !== undefined) {
                    this.empresaId = usuario.id;
                } else {
                    this.presentAlert('Error', 'El usuario no tiene un ID válido.');
                }
            },
            error: () => {
                this.presentAlert('Error', 'No se pudo cargar el usuario.');
            }
        });
    }

    seleccionarFoto(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            this.foto = event.target.files[0];
        }
    }

    crearEvento() {
        if (!this.foto) {
            this.presentAlert('Error', 'Por favor, selecciona una foto.');
            return;
        }
        if (this.empresaId === undefined) {
            this.presentAlert('Error', 'Usuario no autenticado.');
            return;
        }
        if (!this.titulo || !this.descripcion || !this.fecha || !this.horaApertura || !this.horaFinalizacion) {
            this.presentAlert('Error', 'Por favor, completa todos los campos.');
            return;
        }
        const fechaFormateada = this.fecha.split('T')[0];
        const horaAperturaFormateada = this.horaApertura.split('T')[1]?.slice(0, 5) || this.horaApertura;
        const horaFinalizacionFormateada = this.horaFinalizacion.split('T')[1]?.slice(0, 5) || this.horaFinalizacion;
        const formData = new FormData();
        formData.append('titulo', this.titulo);
        formData.append('descripcion', this.descripcion);
        formData.append('fecha', fechaFormateada);
        formData.append('horaApertura', horaAperturaFormateada);
        formData.append('horaFinalizacion', horaFinalizacionFormateada);
        formData.append('idEmpresa', this.empresaId.toString());
        formData.append('precio', this.precio.toString());
        formData.append('foto', this.foto);
        this.eventoService.crearEvento(formData).subscribe({
            next: () => {
                this.presentAlert('Éxito', 'Evento creado exitosamente.');
                this.router.navigate(['/eventos-empresa']);
            },
            error: () => {
                this.presentAlert('Error', 'Error al crear el evento.');
            }
        });
    }

    async presentAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: ['OK']
        });
        await alert.present();
    }
}
