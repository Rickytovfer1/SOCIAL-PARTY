import {Component, OnInit} from '@angular/core';
import {AlertController, IonicModule} from "@ionic/angular";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavSuperiorAdminComponent} from "../nav-superior-admin/nav-superior-admin.component";
import {NavInferiorAdminComponent} from "../nav-inferior-admin/nav-inferior-admin.component";
import {ClienteDTO} from "../modelos/ClienteDTO";
import {environment} from "../../environments/environment";
import {EmpresaDTO} from "../modelos/EmpresaDTO";
import {ActivatedRoute, Router} from "@angular/router";
import {Evento} from "../modelos/Evento";
import {Usuario} from "../modelos/Usuario";
import {PerfilServicio} from "../servicios/perfil.service";
import {NgOptimizedImage} from "@angular/common";
import {AdminService} from "../servicios/admin.service";
import {EditarEstrellaDTO} from "../modelos/EditarEstrellaDTO";

@Component({
    selector: 'app-ver-info-admin',
    templateUrl: './ver-info-admin.component.html',
    styleUrls: ['./ver-info-admin.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorComponent,
        NavSuperiorComponent,
        NavSuperiorAdminComponent,
        NavInferiorAdminComponent,
        NgOptimizedImage
    ]
})
export class VerInfoAdminComponent implements OnInit {
    baseUrl: string = environment.apiUrl;
    cliente: ClienteDTO = {} as ClienteDTO;
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

    getImageUrlCliente(clienteDTO: ClienteDTO): string {
        if (!clienteDTO.fotoPerfil || clienteDTO.fotoPerfil.trim() === '') {
            return 'assets/iconoPerfil.png';
        } else if (clienteDTO.fotoPerfil.startsWith('http')) {
            return clienteDTO.fotoPerfil;
        } else {
            return `${this.baseUrl}${clienteDTO.fotoPerfil}`;
        }
    }

    cargarCliente(idCliente: number): void {
        this.adminService.getCliente(idCliente).subscribe({
            next: (cliente: ClienteDTO) => {
                this.cliente = cliente;
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }
    async confirmarEliminarCliente() {
        const alert = await this.alertController.create({
            header: 'Confirmar eliminación',
            message: '¿Estás seguro de que deseas eliminar esta cuenta?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        console.log('Eliminación cancelada');
                    }
                },
                {
                    text: 'Eliminar',
                    handler: () => {
                        this.eliminarCliente(this.idCliente);
                    }
                }
            ]
        });

        await alert.present();
    }

    async abrirModalEstrellas() {
        const alert = await this.alertController.create({
            header: 'Modificar Estrellas',
            inputs: [
                {
                    name: 'estrellas',
                    type: 'range',
                    min: 0,
                    max: 5,
                    value: this.cliente.valoracion,
                    step: 0.5
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Guardar',
                    handler: (data) => {
                        this.guardarValoracion(data.estrellas);
                    }
                }
            ]
        });

        await alert.present();
    }

    eliminarCliente(idCliente: number): void {
        this.adminService.eliminarCliente(idCliente).subscribe({
            next: () => {
                this.router.navigate(['/principal-admin'])
                console.log("Cliente eliminado exitosamente");
            },
            error: (e) => {
                console.error("Error al eliminar el usuario:", e);
            }
        });
    }

    irModificar(idCliente: number): void{
        this.router.navigate(['/editar-cliente-admin', idCliente])
    }


    guardarValoracion(nuevaValoracion: number) {
        const editarEstrellaDTO: EditarEstrellaDTO = {
            idCliente: this.idCliente,
            valoracion: nuevaValoracion
        };

        this.editarCliente(editarEstrellaDTO);
    }

    editarCliente(editarEstrellaDTO: EditarEstrellaDTO): void {
        this.adminService.editarEstrellas(editarEstrellaDTO).subscribe({
            next: () => {
                this.router.navigate(['/principal-admin'])
                console.log("Cliente eliminado exitosamente");
            },
            error: (e) => {
                console.error("Error al eliminar el usuario:", e);
            }
        });
    }
}
