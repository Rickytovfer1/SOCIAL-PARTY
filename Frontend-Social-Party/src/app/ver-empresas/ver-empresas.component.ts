import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { FormsModule } from "@angular/forms";
import { NgOptimizedImage } from "@angular/common";
import { Router } from "@angular/router";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { EmpresaService } from '../servicios/empresa.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Empresa } from "../modelos/Empresa";
import { environment } from "../../environments/environment";
import { NavLateralComponent } from "../nav-lateral/nav-lateral.component";

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
        NgOptimizedImage,
        NavLateralComponent
    ]
})
export class VerEmpresasComponent implements OnInit {
    empresas: Empresa[] = [];
    empresasFiltradas: Empresa[] = [];
    buscar: string = '';
    baseUrl: string = environment.apiUrl;

    valoracionRange: { lower: number, upper: number } = { lower: 0, upper: 100 };
    showRangeFilter: boolean = false;

    constructor(private router: Router, private empresaService: EmpresaService) { }

    ngOnInit() {
        this.empresaService.listarEmpresas().subscribe((data: Empresa[]) => {
            this.empresas = data;
            this.aplicarFiltros();
        });
    }

    aplicarFiltros() {
        this.empresasFiltradas = this.empresas.filter(empresa => {
            const matchesSearch = !this.buscar ||
                empresa.nombre.toLowerCase().includes(this.buscar.toLowerCase()) ||
                empresa.direccion.toLowerCase().includes(this.buscar.toLowerCase());
            const matchesRange = !this.showRangeFilter ||
                (empresa.valoracionMinima >= this.valoracionRange.lower &&
                    empresa.valoracionMinima <= this.valoracionRange.upper);
            return matchesSearch && matchesRange;
        });
    }

    onSearchChange(event: any) {
        this.buscar = event.target.value;
        this.aplicarFiltros();
    }

    sortByValoracionAsc() {
        this.empresasFiltradas.sort((a, b) => a.valoracionMinima - b.valoracionMinima);
    }

    sortByValoracionDesc() {
        this.empresasFiltradas.sort((a, b) => b.valoracionMinima - a.valoracionMinima);
    }

    toggleRangeFilter() {
        this.showRangeFilter = !this.showRangeFilter;
        this.aplicarFiltros();
    }

    filterByRange() {
        this.aplicarFiltros();
    }

    verEventos(idEmpresa: number) {
        this.router.navigate(['/ver-eventos', idEmpresa]);
    }

    verEntradas() {
        this.router.navigate(['/ver-entradas']);
    }

    getImageUrl(empresa: Empresa): string {
        if (!empresa.fotoPerfil || empresa.fotoPerfil.trim() === '') {
            return 'assets/iconoPerfil.png';
        } else if (empresa.fotoPerfil.startsWith('http')) {
            return empresa.fotoPerfil;
        } else {
            return `${this.baseUrl}${empresa.fotoPerfil}`;
        }
    }
}
