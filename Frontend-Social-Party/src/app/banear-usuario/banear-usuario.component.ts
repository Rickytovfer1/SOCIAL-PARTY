import {Component, OnInit} from '@angular/core';
import {AlertController, IonicModule} from "@ionic/angular";
import {NavSuperiorAdminComponent} from "../nav-superior-admin/nav-superior-admin.component";
import {NavInferiorAdminComponent} from "../nav-inferior-admin/nav-inferior-admin.component";
import {AdminService} from "../servicios/admin.service";
import {environment} from "../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {Cliente} from "../modelos/Cliente";

@Component({
    selector: 'app-banear-usuario',
    templateUrl: './banear-usuario.component.html',
    styleUrls: ['./banear-usuario.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorAdminComponent,
        NavInferiorAdminComponent
    ]
})
export class BanearUsuarioComponent implements OnInit {

    baseUrl: string = environment.apiUrl;
    cliente: Cliente = {} as Cliente;
    idCliente!: number;
    constructor(private activateRoute: ActivatedRoute,
                private adminService: AdminService,
                private alertController: AlertController,
                private router: Router) {

    }

    ngOnInit() {
        this.activateRoute.params.subscribe(params => {
            this.idCliente = Number(params['id']);
        });
        this.cargarCliente(this.idCliente)
    }

    cargarCliente(idCliente: number): void {
        this.adminService.getCliente(idCliente).subscribe({
            next: (cliente: Cliente) => {
                this.cliente = cliente;
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    banearCliente(idCliente: number): void {
        this.adminService.banearCliente(idCliente).subscribe({
            next: () => {
                console.log("Cliente exitosamente");
                location.reload()
            },
            error: (e) => {
                console.error("Error al banear al usuario:", e);
            }
        });
    }

}
