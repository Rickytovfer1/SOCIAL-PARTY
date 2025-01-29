import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RegistroCliente} from "../modelos/RegistroCliente";
import {RegistroClienteService} from "../servicios/registro-cliente.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

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
export class RegistrarClienteComponent  implements OnInit {

  registro: RegistroCliente = {
    nombre: "",
    apellidos: "",
    dni: "",
    fechaNacimiento: "",
    telefono: "",
    correo: "",
    contrasena: ""
  }

  constructor(private registroClienteService: RegistroClienteService, private router: Router) { }

  ngOnInit() {}

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
      if (this.registro.contrasena !== repetirContrasena) {
          const toast = document.getElementById("toastContrasena") as any;
          toast.present();
          return;
      }
      this.registroClienteService.registrar(this.registro).subscribe({
        next: (respuesta) => console.info("registro exitoso"),
        error: (e) => console.error(e),
        complete: () => this.router.navigate(['/login'])
      })
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
