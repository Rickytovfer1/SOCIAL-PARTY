import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from "@ionic/angular";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { Router } from "@angular/router";
import { PublicacionService } from '../servicios/publicacion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
        FormsModule
    ]
})
export class CrearPublicacionComponent implements OnInit {
    texto: string = '';
    titulo: string = '';
    direccion: string = '';
    foto: File | null = null;
    idUsuario: number = 1;

    constructor(
        private router: Router,
        private publicacionService: PublicacionService,
        private alertController: AlertController
    ) { }

    ngOnInit() { }

    seleccionarFoto(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            this.foto = event.target.files[0];
        }
    }

    publicar() {
        if (!this.foto) {
            this.presentAlert('Error', 'Por favor, selecciona una foto.');
            return;
        }

        const dto = {
            texto: this.texto,
            titulo: this.titulo,
            direccion: this.direccion,
            idUsuario: this.idUsuario
        };

        this.publicacionService.crearPublicacionCliente(dto, this.foto).subscribe(() => {
            this.presentAlert('Éxito', 'Publicación creada exitosamente.');
            this.router.navigate(['/publicaciones']);
        }, (error: any) => {
            console.error('Error al crear publicación', error);
            this.presentAlert('Error', 'Error al crear publicación.');
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
