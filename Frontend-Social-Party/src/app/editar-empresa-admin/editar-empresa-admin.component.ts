import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavInferiorEmpresaComponent} from "../nav-inferior-empresa/nav-inferior-empresa.component";
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";
import {NgOptimizedImage} from "@angular/common";
import {NavSuperiorAdminComponent} from "../nav-superior-admin/nav-superior-admin.component";
import {NavInferiorAdminComponent} from "../nav-inferior-admin/nav-inferior-admin.component";
import {EmpresaDTO} from "../modelos/EmpresaDTO";
import {environment} from "../../environments/environment";
import {AdminService} from "../servicios/admin.service";
import {ActivatedRoute} from "@angular/router";
import {UsuarioService} from "../servicios/usuario.service";
import {ClienteService} from "../servicios/cliente.service";
import {PerfilServicio} from "../servicios/perfil.service";
import {Usuario} from "../modelos/Usuario";
import {PerfilEmpresa} from "../modelos/PerfilEmpresa";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-editar-empresa-admin',
    templateUrl: './editar-empresa-admin.component.html',
    styleUrls: ['./editar-empresa-admin.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavInferiorEmpresaComponent,
        NavSuperiorEmpresaComponent,
        NgOptimizedImage,
        NavSuperiorAdminComponent,
        NavInferiorAdminComponent,
        FormsModule
    ]
})
export class EditarEmpresaAdminComponent implements OnInit {
    baseUrl: string = environment.apiUrl;
    usuario: Usuario = {} as Usuario;
    perfilEmpresa: PerfilEmpresa = {} as PerfilEmpresa;
    foto: File | null = null;
    editar: boolean = false;

    empresa: EmpresaDTO = {} as EmpresaDTO;
    idEmpresa!: number;

    constructor(private adminService: AdminService,
                private activateRoute: ActivatedRoute,
                private usuarioService: UsuarioService,
                private clienteService: ClienteService,
                private perfilService: PerfilServicio) {
    }

    ngOnInit() {
        this.activateRoute.params.subscribe(params => {
            this.idEmpresa = Number(params['id']);
        });
        this.cargarPerfil(this.idEmpresa)
        this.cargarUsuario(this.idEmpresa)
    }

    getImageUrl(empresaDTO: EmpresaDTO): string {
        if (!empresaDTO.fotoPerfil || empresaDTO.fotoPerfil.trim() === '') {
            return 'assets/iconoPerfil.png';
        } else if (empresaDTO.fotoPerfil.startsWith('http')) {
            return empresaDTO.fotoPerfil;
        } else {
            return `${this.baseUrl}${empresaDTO.fotoPerfil}`;
        }
    }

    cargarUsuario(idEmpresa: number): void {
        this.adminService.getUsuarioEmpresa(idEmpresa).subscribe({
            next: (usuario: Usuario) => {
                this.usuario = usuario;
            },
            error: (e) => {
                console.error("Error al cargar el perfil:", e);
            }
        });
    }

    cargarPerfil(idEmpresa: number): void {
        this.adminService.getEmpresa(idEmpresa).subscribe({
            next: (perfilEmpresa: PerfilEmpresa) => {
                this.perfilEmpresa = perfilEmpresa;
            },
            error: (e) => {
                console.error("Error al cargar la empresa:", e);
            }
        });
    }

    guardarCambios(): void {
        const formData = new FormData();
        const empresaData = {
            id: this.perfilEmpresa.id,
            nombre: this.perfilEmpresa.nombre,
            direccion: this.perfilEmpresa.direccion,
            cp: this.perfilEmpresa.cp,
            telefono: this.perfilEmpresa.telefono,
            correo: this.usuario.correo,
            nif: this.perfilEmpresa.nif,
            edadMinima: this.perfilEmpresa.edadMinima || "",
            valoracionMinima: this.perfilEmpresa.valoracionMinima || ""
        };
        formData.append("empresa", new Blob([JSON.stringify(empresaData)], { type: "application/json" }));
        if (this.foto) {
            formData.append("fotoPerfil", this.foto);
        }
        this.adminService.actualizarPerfilEmpresa(formData).subscribe({
            next: (updatedPerfil: PerfilEmpresa) => {
                this.perfilEmpresa = updatedPerfil;
                this.foto = null;
            },
            error: (err) => {
                console.error("Error al actualizar la empresa:", err);
            }
        });
    }

    editarBoton(): void {
        if (this.editar) {
            this.guardarCambios();
            this.editar = false;
        } else {
            this.editar = true;
        }
    }

    seleccionarFoto(event: any): void {
        if (event.target.files && event.target.files.length > 0) {
            this.foto = event.target.files[0];
            // @ts-ignore
            console.log('Foto seleccionada:', this.foto.name);
        }
    }
}
