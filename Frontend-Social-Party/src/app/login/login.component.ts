import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {Login} from "../modelos/Login";
import {Registro} from "../modelos/Registro";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class LoginComponent  implements OnInit {

  login: Login = new Login();
  loginViewFlag: boolean = true;

  constructor(private router: Router, private fb: FormBuilder) { }

  ngOnInit() {}

  // doLogin(): void {
  //
  //   if (this.loginForm.valid) {
  //     this.login = {...this.login, ...this.loginForm.value};
  //     this.loginService.loguear(this.login).subscribe({
  //       next: (respuesta) => {
  //         const token = respuesta.token; // Accede al token
  //         sessionStorage.setItem("authToken", token);
  //
  //         // Notificar sobre el cambio en el estado de autenticación
  //         this.loginService.setAuthState(true);
  //
  //       },
  //       error: (e) => console.error(e),
  //       complete: () => this.router.navigate([''])
  //     })
  //
  //
  //   } else {
  //     console.log('Formulario inválido. Por favor verifica los datos.');
  //   }
  //
  // }
  //
  // goRegister() {
  //   this.loginViewFlag = false;
  //   this.ngOnInit()
  //
  //
  // }
  //
  // goLogin() {
  //   this.loginViewFlag = true;
  //   this.ngOnInit()
  // }

}
