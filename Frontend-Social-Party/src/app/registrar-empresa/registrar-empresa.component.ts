import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {RegistroEmpresaService} from "../servicios/registro-empresa.service";
import {RegistroEmpresa} from "../modelos/RegistroEmpresa";
import {FormsModule} from "@angular/forms";

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
export class RegistrarEmpresaComponent  implements OnInit {

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

  constructor(private registroEmpresaService: RegistroEmpresaService, private router: Router) { }

  ngOnInit() {}

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

        if (this.registro.contrasena !== repetirContrasena) {
            const toast = document.getElementById("toastContrasena") as any;
            toast.present();
            return;
        }

        this.registroEmpresaService.registrar(this.registro).subscribe({
            next: () => {
                console.info("Registro exitoso");
                this.router.navigate(['/login']);
            },
            error: (e) => console.error(e),
        });
    }



    goRegister() {
    this.doRegister()
  }

  volver() {
    this.router.navigate(['/registrar-cliente'])
  }
}
