import { Component, OnInit } from '@angular/core';
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { IonicModule, AlertController } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { PublicacionService } from '../servicios/publicacion.service';
import { UsuarioService } from "../servicios/usuario.service";
import { TokenDataDTO } from "../modelos/TokenDataDTO";
import { Usuario } from "../modelos/Usuario";
import {jwtDecode }from "jwt-decode";
import {NavSuperiorEmpresaComponent} from "../nav-superior-empresa/nav-superior-empresa.component";
import {NavInferiorEmpresaComponent} from "../nav-inferior-empresa/nav-inferior-empresa.component";
import {Cliente} from "../modelos/Cliente";
import {CrearPublicacionEmpresa} from "../modelos/CrearPublicacionEmpresa";
import {Evento} from "../modelos/Evento";
import {Empresa} from "../modelos/Empresa";
import {ClienteService} from "../servicios/cliente.service";
import {EventoService} from "../servicios/evento.service";
import {EmpresaService} from "../servicios/empresa.service";

@Component({
    selector: 'app-crear-publicacion-empresa',
    templateUrl: './crear-publicacion-empresa.component.html',
    styleUrls: ['./crear-publicacion-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        NavSuperiorEmpresaComponent,
        NavInferiorEmpresaComponent
    ]
})
export class CrearPublicacionEmpresaComponent implements OnInit {
    empresa: Empresa = {} as Empresa;

    publicacion: CrearPublicacionEmpresa = {
        nombre: "",
        texto: "",
        foto: undefined,
        lugar: "",
        idUsuario: 0
    }

    constructor(
        private router: Router,
        private publicacionService: PublicacionService,
        private usuarioService: UsuarioService,
        private empresaService: EmpresaService
    ) { }

    ngOnInit() {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode<{ tokenDataDTO: TokenDataDTO }>(token);
                const tokenDataDTO = decodedToken?.tokenDataDTO;
                if (tokenDataDTO && tokenDataDTO.correo) {
                    this.cargarUsuario(tokenDataDTO.correo)
                }
            } catch (e) {
                console.error('Error al decodificar el token:', e);
            }
        }
    }

    cargarUsuario(correo: string): void {
        this.usuarioService.getUsuarioEmpresa(correo).subscribe({
            next: (usuario: Usuario) => {
                if (usuario.id !== undefined) {
                    this.publicacion.idUsuario = usuario.id;
                    this.cargarEmpresa(usuario.id)
                    console.log(usuario.id)
                } else {
                    console.log('Error', 'El usuario no tiene un ID válido.');
                }
            },
            error: () => {
                console.log('Error', 'No se pudo cargar el usuario.');
            }
        });
    }

    cargarEmpresa(idUsuario: number) {
        this.empresaService.getPerfilEmpresa(idUsuario).subscribe({
            next: (empresa: Empresa)=> {
                this.empresa = empresa
            },
            error: (e) => {
                console.error("Error al cargar la empresa:", e);
            }
        })
    }

    seleccionarFoto(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            this.publicacion.foto = event.target.files[0];
        }
    }

    publicar() {

        this.publicacion.nombre = this.empresa.nombre
        this.publicacion.lugar = this.empresa.nombre

        if (!this.publicacion.texto) {
            console.log("Falta texto")
            return
        }
        if (!this.publicacion.idUsuario) {
            console.log("Falta id usuario")
            return
        }
        if (!this.publicacion.foto) {
            console.log("Falta foto")
            return
        }

        if (!this.publicacion.lugar) {
            console.log("Falta el lugar")
            return
        }

        this.publicacionService.crearPublicacionEmpresa(this.publicacion).subscribe({
            next: () => {
                console.log('Éxito', 'Publicación creada exitosamente.');
                this.router.navigate(['/asistentes-evento-empresa']);
            },
            error: e => {
                console.log('Error', 'Error al crear publicación.');
            }
        })
    }
}
