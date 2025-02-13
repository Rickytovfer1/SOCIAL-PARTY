import {Component, OnInit} from '@angular/core';
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";
import {NavSuperiorAdminComponent} from "../nav-superior-admin/nav-superior-admin.component";
import {NavInferiorAdminComponent} from "../nav-inferior-admin/nav-inferior-admin.component";
import {IonicModule} from "@ionic/angular";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {AdminService} from "../servicios/admin.service";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";
import {Cliente} from "../modelos/Cliente";
import {Empresa} from "../modelos/Empresa";

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

    empresas: Empresa[] = [];
    clientes: Cliente[] = [];

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
            next: (empresa: Empresa[]) => {
                this.empresas = empresa;
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }

    verClientes(): void {
        this.adminService.verClientes().subscribe({
            next: (cliente: Cliente[]) => {
                this.clientes = cliente;
            },
            error: (e) => {
                console.error("Error al cargar el usuario:", e);
            }
        });
    }
    getImageUrl(empresaDTO: Empresa): string {
        if (!empresaDTO.fotoPerfil || empresaDTO.fotoPerfil.trim() === '') {
            return 'assets/iconoPerfil.png';
        }else if (empresaDTO.fotoPerfil.startsWith('http')) {
            return empresaDTO.fotoPerfil;
        } else {
            return `${this.baseUrl}${empresaDTO.fotoPerfil}`;
        }
    }

    getImageUrlCliente(clienteDTO: Cliente): string {
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

    verInfoEmpresa(idEmpresa: number) {
        this.router.navigate(["/ver-empresa-admin", idEmpresa])
    }
}
