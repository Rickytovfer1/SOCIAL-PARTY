import {Component, OnInit} from '@angular/core';
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";
import {NavSuperiorAdminComponent} from "../nav-superior-admin/nav-superior-admin.component";
import {NavInferiorAdminComponent} from "../nav-inferior-admin/nav-inferior-admin.component";
import {IonicModule} from "@ionic/angular";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {EmpresaDTO} from "../modelos/EmpresaDTO";
import {AdminService} from "../servicios/admin.service";
import {ClienteDTO} from "../modelos/ClienteDTO";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

@Component({
    selector: 'app-principal-admin',
    templateUrl: './principal-admin.component.html',
    styleUrls: ['./principal-admin.component.scss'],
    standalone: true,
    imports: [
        NavSuperiorEmpresaComponent,
        NavSuperiorAdminComponent,
        NavInferiorAdminComponent,
        IonicModule,
        NgOptimizedImage,
        NgIf,
        NgForOf
    ]
})
export class PrincipalAdminComponent implements OnInit {

    segmentoSeleccionado: string = 'clientes';
    baseUrl: string = environment.apiUrl;

    empresas: EmpresaDTO[] = [];
    clientes: ClienteDTO[] = [];

    constructor(private adminService: AdminService,
                private router: Router) {
    }

    ngOnInit() {
        this.verEmpresas()
        this.verClientes()
    }

    cambio(event: any) {
        this.segmentoSeleccionado = event.detail.value;
    }

    verEmpresas(): void {
        this.adminService.verEmpresas().subscribe({
            next: (empresa: EmpresaDTO[]) => {
                this.empresas = empresa;
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    verClientes(): void {
        this.adminService.verClientes().subscribe({
            next: (cliente: ClienteDTO[]) => {
                this.clientes = cliente;
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }
    getImageUrl(empresaDTO: EmpresaDTO): string {
        if (empresaDTO.fotoPerfil.startsWith('http')) {
            return empresaDTO.fotoPerfil;
        } else {
            return `${this.baseUrl}${empresaDTO.fotoPerfil}`;
        }
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

    verInfo(idCliente: number) {
        this.router.navigate(["/ver-info-admin", idCliente])
    }
}
