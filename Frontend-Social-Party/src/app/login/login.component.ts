import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {Login} from "../modelos/Login";
import {LoginService} from "../servicios/login.service";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,

  ]
})
export class LoginComponent  implements OnInit {

  login: Login = {
    correo: "",
    contrasena: ""
  };

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {}

    doLogin(): void {
        if (!this.login.correo || !this.login.contrasena) {
            const toast = document.getElementById("toastCampos") as any;
            toast.present();
            return;
        }

        this.loginService.loguear(this.login).subscribe({
            next: (respuesta) => {
                const token = respuesta.token;
                sessionStorage.setItem("authToken", token);
                this.loginService.setAuthState(true);

                try {
                    const decodedToken = jwtDecode(token) as { tokenDataDTO: TokenDataDTO };
                    console.log('Decoded Token:', decodedToken);

                    const rol = decodedToken?.tokenDataDTO.rol;

                    if (rol == "CLIENTE") {
                        this.router.navigate(['/amigos']);
                    }else if (rol === "EMPRESA") {
                        this.router.navigate(['/asistentes-evento-empresa']);
                    }else {
                        this.router.navigate(['/principal-admin']);
                    }
                } catch (e) {
                    console.error('Error al decodificar el token');
                }
            },
            error: (e) => {
                const toast = document.getElementById("toastContrasenaIncorrecta") as any;
                toast.present();

            }
        });
    }


    goLogin() {
    this.doLogin()
  }

  irRegistro() {
    this.router.navigate(['/registrar-cliente'])
  }

}
