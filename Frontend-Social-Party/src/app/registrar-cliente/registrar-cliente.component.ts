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
    if (this.registro) {

      this.registroClienteService.registrar(this.registro).subscribe({
        next: (respuesta) => console.info("registro exitoso"),
        error: (e) => console.error(e),
        complete: () => this.router.navigate(['/login'])
      })

    } else {
      console.log('Formulario inválido. Por favor verifica los datos.');
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
