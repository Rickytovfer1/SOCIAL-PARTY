import {Component, OnInit} from '@angular/core';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRow,
    IonGrid,
    IonCol,
    IonImg,
    IonButton
} from '@ionic/angular/standalone';
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    imports: [IonContent, IonRow, IonGrid, IonCol, IonImg, NgForOf, IonButton, NgIf],
    standalone: true
})
export class HomePage implements OnInit{

    imagenes = ['assets/imagen1.webp', 'assets/imagen2.webp', 'assets/imagen3.jpg'];
    imagenActual = this.imagenes[0];
    indice = 0;
    esUltimaImagen = false;


    constructor(private router: Router) {}


    ngOnInit() {
    }


    cambiarImagen() {
        if (this.indice === this.imagenes.length - 1) {
            this.esUltimaImagen = true;
        } else {
            this.indice++;
            this.imagenActual = this.imagenes[this.indice];
            this.esUltimaImagen = false;
        }
    }

    accionBoton() {
        if (this.esUltimaImagen) {
            this.router.navigate(['/login']);
        } else {
            this.cambiarImagen();
        }
    }
}
