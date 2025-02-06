import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { FormsModule } from "@angular/forms";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import { Router } from "@angular/router";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { EmpresaService } from '../servicios/empresa.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {EmpresaDTO} from "../modelos/EmpresaDTO";
import {environment} from "../../environments/environment";
import {MostrarPublicacionDTO} from "../servicios/publicacion.service";

@Component({
    selector: 'app-ver-empresas',
    templateUrl: './ver-empresas.component.html',
    styleUrls: ['./ver-empresas.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        FormsModule,
        NavInferiorComponent,
        CommonModule,
        HttpClientModule,
        NgOptimizedImage
    ]
})
export class VerEmpresasComponent implements OnInit {
    empresas: EmpresaDTO[] = [];
    empresasFiltradas: EmpresaDTO[] = [];
    buscar: string = '';
    baseUrl: string = environment.apiUrl;

    constructor(private router: Router, private empresaService: EmpresaService) { }

    ngOnInit() {
        this.empresaService.listarEmpresas().subscribe((data: EmpresaDTO[]) => {
            this.empresas = data;
            this.empresasFiltradas = data;
        });
    }

    // verEventosEmpresa(id: number) {
    //     this.router.navigate(['/ver-eventos', id]);
    // }

    onSearchChange(event: any) {
        const val = event.target.value.toLowerCase();
        if (val) {
            this.empresasFiltradas = this.empresas.filter((empresa) =>
                empresa.nombre.toLowerCase().includes(val) ||
                empresa.direccion.toLowerCase().includes(val)
            );
        } else {
            this.empresasFiltradas = this.empresas;
        }
    }

    //Función provisional hasta que se le aplique lógica a "ver-eventos"
    verEventos(idEmpresa: number) {
        this.router.navigate(['/ver-eventos', idEmpresa]);
    }

    verEntradas() {
        this.router.navigate(['/ver-entradas']);
    }

    getImageUrl(empresaDTO: EmpresaDTO): string {
        if (empresaDTO.fotoPerfil.startsWith('http')) {
            return empresaDTO.fotoPerfil;
        } else {
            return `${this.baseUrl}${empresaDTO.fotoPerfil}`;
        }
    }
}
