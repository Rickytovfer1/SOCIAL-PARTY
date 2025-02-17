import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {RegistroEmpresaService} from "../servicios/registro-empresa.service";
import {RegistroEmpresa} from "../modelos/RegistroEmpresa";
import {FormsModule} from "@angular/forms";
import {EMPTY} from "rxjs";

@Component({
    selector: 'app-registrar-empresa',
    templateUrl: './registrar-empresa.component.html',
    styleUrls: ['./registrar-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule
    ]
})
export class RegistrarEmpresaComponent implements OnInit {

    registro: RegistroEmpresa = {
        nombre: "",
        direccion: "",
        codigoPostal: "",
        nif: "",
        telefono: "",
        valoracionMinima: 50,
        edadMinima: 18,
        correo: "",
        contrasena: ""
    }

    repContrasena = ""

    constructor(private registroEmpresaService: RegistroEmpresaService, private router: Router) {
    }

    ngOnInit() {
    }

    validarNIF(nif: string): boolean {
        const nifRegistrado = /^[0-9]{8}[A-Za-z]$/;
        return nifRegistrado.test(nif);
    }

    validarCorreo(correo: string): boolean {
        const correoRegistrado = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return correoRegistrado.test(correo);
    }

    validarTelefono(telefono: string): boolean {
        const telefonoRegistrado = /^[0-9]{9}$/;
        return telefonoRegistrado.test(telefono);
    }

    doRegister() {
        const repetirContrasena = (document.querySelector('ion-input[placeholder="Por favor, repita la contaseña"]') as HTMLInputElement)?.value;

        if (
            !this.registro.nombre ||
            !this.registro.direccion ||
            !this.registro.codigoPostal ||
            !this.registro.nif ||
            !this.registro.telefono ||
            !this.registro.correo ||
            !this.registro.contrasena
        ) {
            const toast = document.getElementById("toastCampos") as any;
            toast.present();
            return;
        }
        if (!this.validarNIF(this.registro.nif)) {
            const toast = document.getElementById("nif") as any;
            toast.present();
            return;
        }

        if (!this.validarCorreo(this.registro.correo)) {
            const toast = document.getElementById("correo") as any;
            toast.present();
            return;
        }

        if (!this.validarTelefono(this.registro.telefono)) {
            const toast = document.getElementById("telefono") as any;
            toast.present();
            return;
        }

        if (this.registro.contrasena.length < 6) {
            const toast = document.getElementById("contrasena") as any;
            toast.present();
            return;
        }

        if (this.registro.contrasena !== this.repContrasena) {
            const toast = document.getElementById("toastContrasena") as any;
            toast.present();
            return;
        }

        this.registroEmpresaService.registrar(this.registro).subscribe({
            next: () => {
                console.info("Registro exitoso");
                this.router.navigate(['/login']);
            },
            error: (errorResponse) => {
                this.manejarErrorBackend(errorResponse);
                console.error = () => {};
                return EMPTY;
            }
        });
    }

    private manejarErrorBackend(error: any) {

        if (error.status === 400 && error.error) {
            const mensaje = error.error;

            if (mensaje.includes("correo")) {
                const toast = document.getElementById("existeCorreo") as any;
                toast.present();
            } else if (mensaje.includes("NIF")) {
                const toast = document.getElementById("existeNIF") as any;
                toast.present();
            } else if (mensaje.includes("teléfono")) {
                const toast = document.getElementById("existeTelefono") as any;
                toast.present();
            } else {
                const toast = document.getElementById("error") as any;
                toast.present();
            }
        } else {
            console.error("Ocurrió un error inesperado. Intente más tarde.", "toastError");
        }
    }


    goRegister() {
        this.doRegister()
    }

    volver() {
        this.router.navigate(['/registrar-cliente'])
    }

    ionViewWillEnter() {
        this.ngOnInit()
    }
}
