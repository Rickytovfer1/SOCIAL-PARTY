import { Component, OnInit } from '@angular/core';
import { NoticiaService } from '../../services/noticia.service';
import { Noticia } from '../../models/noticia.model';
import { CommonModule } from '@angular/common';
import { IonicModule, IonCard } from '@ionic/angular';
import {RouterLink} from "@angular/router";
import {NavSuperiorComponent} from "../../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../../nav-inferior/nav-inferior.component";

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink,NavSuperiorComponent,NavInferiorComponent],
})
export class NoticiasPage implements OnInit {
  noticias: Noticia[] = [];
  isLoading: boolean = true;

  constructor(private noticiaService: NoticiaService) {}

  ngOnInit() {
    this.noticias = this.noticiaService.getNoticias();
    this.isLoading = false;
    console.log('Noticias cargadas:', this.noticias);
  }
}
