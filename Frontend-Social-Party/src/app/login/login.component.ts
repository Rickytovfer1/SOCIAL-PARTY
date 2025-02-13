import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../modelos/Login';
import { LoginService } from '../servicios/login.service';
import { jwtDecode} from 'jwt-decode';
import { TokenDataDTO } from '../modelos/TokenDataDTO';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [IonicModule, FormsModule]
})
export class LoginComponent implements OnInit {

    login: Login = {
        correo: "",
        contrasena: ""
    };

    constructor(
        private router: Router,
        private loginService: LoginService,
        private toastController: ToastController
    ) { }

    ngOnInit() {}

    async doLogin(): Promise<void> {
        if (!this.login.correo || !this.login.contrasena) {
            const toast = await this.toastController.create({
                message: "Por favor, complete todos los campos obligatorios.",
                duration: 3000,
                color: 'danger',
                position: 'top'
            });
            await toast.present();
            return;
        }

        this.loginService.loguear(this.login).subscribe({
            next: async (respuesta) => {
                const token = respuesta.token;
                sessionStorage.setItem("authToken", token);
                this.loginService.setAuthState(true);

                try {
                    const decodedToken = jwtDecode(token) as { tokenDataDTO: TokenDataDTO };
                    console.log('Decoded Token:', decodedToken);
                    const rol = decodedToken?.tokenDataDTO.rol;

                    if (rol === "CLIENTE") {
                        this.router.navigate(['/amigos']);
                    } else if (rol === "EMPRESA") {
                        this.router.navigate(['/asistentes-evento-empresa']);
                    } else {
                        this.router.navigate(['/principal-admin']);
                    }
                } catch (e) {
                    console.error('Error al decodificar el token:');
                }
            },
            error: async (e) => {
                console.error(e);
                let mensaje = "Error al iniciar sesión.";
                if (e.status === 401 && e.error && e.error.mensaje) {
                    mensaje = e.error.mensaje;
                }
                const toast = await this.toastController.create({
                    message: mensaje,
                    duration: 3000,
                    color: 'warning',
                    position: 'top'
                });
                await toast.present();
            }
        });
    }

    goLogin() {
        this.doLogin();
    }

    irRegistro() {
        this.router.navigate(['/registrar-cliente']);
    }
}
