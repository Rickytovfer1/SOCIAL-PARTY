import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NavSuperiorEmpresaComponent } from '../nav-superior-empresa/nav-superior-empresa.component';
import { NavInferiorEmpresaComponent } from '../nav-inferior-empresa/nav-inferior-empresa.component';
import { NavInferiorComponent } from '../nav-inferior/nav-inferior.component';
import { NavSuperiorComponent } from '../nav-superior/nav-superior.component';
import {EntradaService} from "../servicios/entrada.service";
import {FormsModule} from "@angular/forms";

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

    codigoEntrada: string="";
    constructor(private entradaService: EntradaService,
                ) {}

    ngAfterViewInit() {
        this.startCamera();
    }

    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (this.videoElement && this.videoElement.nativeElement) {
                this.videoElement.nativeElement.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    }

    canjearEntrada(): void {
        if (!this.codigoEntrada) {
            const toast = document.getElementById("toastBlanco") as any;
            toast.present();
            return;
        }

        this.entradaService.canjear(parseInt(this.codigoEntrada)).subscribe({
            next: (entradacanjeada) => {
                console.log('Entrada canjeada con éxito.', entradacanjeada);
            },
            error: (error) => {
                if (error.status === 400) {
                    // Código 400 → La entrada ya fue canjeada
                    const toast = document.getElementById("toastCanjeada") as any;
                    toast.present();
                    console.log("La entrada ya fue canjeada.");
                } else if (error.status === 404) {
                    // Código 404 → No existe la entrada
                    const toast = document.getElementById("toastNoExiste") as any;
                    toast.present();
                    console.log("La entrada no existe.");
                } else {
                    console.error('Error inesperado al canjear la entrada:', error);
                }
            }
        });
    }

}
