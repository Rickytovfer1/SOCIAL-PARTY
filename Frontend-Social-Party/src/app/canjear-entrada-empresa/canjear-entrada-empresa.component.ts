import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NavSuperiorEmpresaComponent } from '../nav-superior-empresa/nav-superior-empresa.component';
import { NavInferiorEmpresaComponent } from '../nav-inferior-empresa/nav-inferior-empresa.component';
import { NavInferiorComponent } from '../nav-inferior/nav-inferior.component';
import { NavSuperiorComponent } from '../nav-superior/nav-superior.component';

@Component({
    selector: 'app-canjear-entrada-empresa',
    templateUrl: './canjear-entrada-empresa.component.html',
    styleUrls: ['./canjear-entrada-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorEmpresaComponent,
        NavInferiorEmpresaComponent,
    ]
})
export class CanjearEntradaEmpresaComponent implements AfterViewInit {
    @ViewChild('videoElement') videoElement!: ElementRef;

    constructor() {}

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
}
