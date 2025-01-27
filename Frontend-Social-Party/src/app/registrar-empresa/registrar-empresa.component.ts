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
    valoracionMinima: 0,
    edadMinima: 18,
    correo: "",
    contrasena: ""
  }

  constructor(private registroEmpresaService: RegistroEmpresaService, private router: Router) { }

  ngOnInit() {}

  doRegister() {
    if (this.registro) {

      this.registroEmpresaService.registrar(this.registro).subscribe({
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

  volver() {
    this.router.navigate(['/registrar-cliente'])
  }
}
