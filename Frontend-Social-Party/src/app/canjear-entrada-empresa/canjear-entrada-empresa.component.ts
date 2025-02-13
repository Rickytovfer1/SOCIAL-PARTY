import { Component, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { NavSuperiorEmpresaComponent } from '../nav-superior-empresa/nav-superior-empresa.component';
import { NavInferiorEmpresaComponent } from '../nav-inferior-empresa/nav-inferior-empresa.component';
import { FormsModule } from "@angular/forms";
import jsQR from "jsqr";
import { EntradaService } from "../servicios/entrada.service";

@Component({
    selector: 'app-canjear-entrada-empresa',
    templateUrl: './canjear-entrada-empresa.component.html',
    styleUrls: ['./canjear-entrada-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorEmpresaComponent,
        NavInferiorEmpresaComponent,
        FormsModule,
    ]
})
export class CanjearEntradaEmpresaComponent implements AfterViewInit {
    @ViewChild('videoElement') videoElement!: ElementRef;
    codigoEntrada: string = "";
    private lastScannedCode: string = "";
    private redeemingInProgress: boolean = false;

    constructor(
        private entradaService: EntradaService,
        private toastController: ToastController,
        private ngZone: NgZone
    ) {}

    ngAfterViewInit() {
        this.startCamera();
    }

    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (this.videoElement && this.videoElement.nativeElement) {
                this.videoElement.nativeElement.srcObject = stream;
                this.scanQRCode();
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    }

    scanQRCode() {
        const video = this.videoElement.nativeElement;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { willReadFrequently: true });
        const tick = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context!.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context!.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);
                if (code) {
                    const newCode = code.data.trim();
                    if (newCode !== this.lastScannedCode) {
                        this.lastScannedCode = newCode;
                        this.codigoEntrada = newCode;
                        if (!this.redeemingInProgress) {
                            this.ngZone.run(() => this.redeemEntrada());
                        }
                    }
                }
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    resetFields() {
        this.codigoEntrada = "";
        this.lastScannedCode = "";
        this.redeemingInProgress = false;
    }

    async redeemEntrada(): Promise<void> {
        if (!this.codigoEntrada) {
            const toast = await this.toastController.create({
                message: 'Por favor, inserte un código de entrada.',
                duration: 3000,
                position: 'top',
                color: 'danger'
            });
            toast.present();
            return;
        }
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            const toast = await this.toastController.create({
                message: 'No estás autenticado. Por favor inicia sesión.',
                duration: 3000,
                position: 'top',
                color: 'danger'
            });
            toast.present();
            return;
        }
        this.redeemingInProgress = true;
        const headers = { 'Authorization': `Bearer ${token}` };
        this.entradaService.canjear(parseInt(this.codigoEntrada), headers).subscribe({
            next: async (resp) => {
                const toast = await this.toastController.create({
                    message: 'Entrada canjeada exitosamente.',
                    duration: 3000,
                    position: 'top',
                    color: 'success'
                });
                toast.present();
                setTimeout(() => {
                    this.resetFields();
                }, 1500);
            },
            error: async (error) => {
                let message = 'Error inesperado al canjear la entrada';
                if (error.status === 400) {
                    if (error.error && error.error.message) {
                        message = error.error.message;
                    }
                    const toast = await this.toastController.create({
                        message,
                        duration: 3000,
                        position: 'top',
                        color: 'warning'
                    });
                    toast.present();
                } else if (error.status === 403) {
                    const toast = await this.toastController.create({
                        message: 'Esta entrada ya ha sido canjeada',
                        duration: 3000,
                        position: 'top',
                        color: 'warning'
                    });
                    toast.present();
                } else if (error.status === 404) {
                    const toast = await this.toastController.create({
                        message: 'Esta entrada no existe',
                        duration: 3000,
                        position: 'top',
                        color: 'warning'
                    });
                    toast.present();
                } else {
                    const toast = await this.toastController.create({
                        message,
                        duration: 3000,
                        position: 'top',
                        color: 'danger'
                    });
                    toast.present();
                }
                setTimeout(() => {
                    this.resetFields();
                }, 1500);
            }
        });
    }
}
