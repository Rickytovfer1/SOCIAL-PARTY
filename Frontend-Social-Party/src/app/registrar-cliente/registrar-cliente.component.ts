import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RegistroCliente} from "../modelos/RegistroCliente";
import {RegistroClienteService} from "../servicios/registro-cliente.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {EMPTY, of} from "rxjs";

@Component({
    selector: 'app-registrar-cliente',
    templateUrl: './registrar-cliente.component.html',
    styleUrls: ['./registrar-cliente.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule
    ]
})
export class RegistrarClienteComponent implements OnInit {

    registro: RegistroCliente = {
        nombre: "",
        apellidos: "",
        dni: "",
        fechaNacimiento: "",
        telefono: "",
        correo: "",
        contrasena: ""
    }

    constructor(private registroClienteService: RegistroClienteService, private router: Router) {
    }

    ngOnInit() {
    }

    validarDNI(dni: string): boolean {
        const dniRegistrado = /^[0-9]{8}[A-Za-z]$/;
        return dniRegistrado.test(dni);
    }

    validarCorreo(correo: string): boolean {
        const correoRegistrado = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return correoRegistrado.test(correo);
    }

    validarTelefono(telefono: string): boolean {
        const telefonoRegistrado = /^[0-9]{9}$/;
        return telefonoRegistrado.test(telefono);
    }

    validarFechaNacimiento(fecha: string): boolean {
        const fechaNacimiento = new Date(fecha);
        const hoy = new Date();
        const edadMinima = 15;
        const fechaMinima = new Date();
        fechaMinima.setFullYear(hoy.getFullYear() - edadMinima);
        return fechaNacimiento <= hoy && fechaNacimiento <= fechaMinima;
    }

    doRegister() {

        const repetirContrasena = (document.querySelector('ion-input[placeholder="Por favor, repita la contaseña"]') as HTMLInputElement)?.value;

        if (
            !this.registro.nombre ||
            !this.registro.apellidos ||
            !this.registro.correo ||
            !this.registro.dni ||
            !this.registro.contrasena ||
            !this.registro.fechaNacimiento ||
            !this.registro.telefono) {
            const toast = document.getElementById("toastCampos") as any;
            toast.present();
            return;
        }

        if (!this.validarDNI(this.registro.dni)) {
            const toast = document.getElementById("dni") as any;
            toast.present();
            return;
        }

        if (!this.validarCorreo(this.registro.correo)) {
            const toast = document.getElementById("correo") as any;
            toast.present();
            return;
        }

        if (!this.validarFechaNacimiento(this.registro.fechaNacimiento)) {
            const toast = document.getElementById("fecha") as any;
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
        if (this.registro.contrasena !== repetirContrasena) {
            const toast = document.getElementById("toastContrasena") as any;
            toast.present();
            return;
        }
        this.registroClienteService.registrar(this.registro).subscribe({
            next: (respuesta) => {
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
            } else if (mensaje.includes("DNI")) {
                const toast = document.getElementById("existeDNI") as any;
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

    irRegistroEmpresa() {
        this.router.navigate(['/registrar-empresa'])
    }

    volver() {
        this.router.navigate(['/login'])
    }

}
