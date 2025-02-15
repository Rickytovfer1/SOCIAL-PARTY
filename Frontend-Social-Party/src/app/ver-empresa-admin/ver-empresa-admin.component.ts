import {Component, OnInit} from '@angular/core';
import {NavSuperiorAdminComponent} from "../nav-superior-admin/nav-superior-admin.component";
import {AlertController, IonicModule} from "@ionic/angular";
import {NavInferiorAdminComponent} from "../nav-inferior-admin/nav-inferior-admin.component";
import {NgOptimizedImage} from "@angular/common";
import {environment} from "../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../servicios/admin.service";
import {Empresa} from "../modelos/Empresa";

@Component({
    selector: 'app-ver-empresa-admin',
    templateUrl: './ver-empresa-admin.component.html',
    styleUrls: ['./ver-empresa-admin.component.scss'],
    standalone: true,
    imports: [
        NavSuperiorAdminComponent,
        IonicModule,
        NavInferiorAdminComponent,
        NgOptimizedImage
    ]
})
export class VerEmpresaAdminComponent implements OnInit {
    baseUrl: string = environment.apiUrl;
    empresa: Empresa = {} as Empresa;
    idEmpresa!: number;

    constructor(private activateRoute: ActivatedRoute,
                private adminService: AdminService,
                private alertController: AlertController,
                private router: Router) {
    }

    ngOnInit() {
        this.activateRoute.params.subscribe(params => {
            this.idEmpresa = Number(params['id']);
        });
        this.cargarEmpresa(this.idEmpresa)
    }

    getImageUrlEmpresa(empresaDTO: Empresa): string {
        if (!empresaDTO.fotoPerfil || empresaDTO.fotoPerfil.trim() === '') {
            return 'assets/iconoPerfil.png';
        } else if (empresaDTO.fotoPerfil.startsWith('http')) {
            return empresaDTO.fotoPerfil;
        } else {
            return `${this.baseUrl}${empresaDTO.fotoPerfil}`;
        }
    }

    cargarEmpresa(idEmpresa: number): void {
        this.adminService.getEmpresaDTO(idEmpresa).subscribe({
            next: (empresa: Empresa) => {
                this.empresa = empresa;
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    async confirmarEliminarEmpresa() {
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
                        this.eliminarEmpresa(this.idEmpresa);
                    }
                }
            ]
        });

        await alert.present();
    }

    eliminarEmpresa(idEmpresa: number): void {
        this.adminService.eliminarEmpresa(idEmpresa).subscribe({
            next: () => {
                this.router.navigate(['/principal-admin'])
                const toast = document.getElementById("toastEliminadoEmpresa") as any;
                toast.present();
                console.log("Empresa eliminada exitosamente");
            },
            error: (e) => {
                console.error("Error al eliminar el usuario:", e);
            }
        });
    }

    irModificar(idCliente: number): void{
        this.router.navigate(['/editar-empresa-admin', idCliente])
    }
}
