// src/app/pages/detalle-noticia/detalle-noticia.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiaService } from '../../services/noticia.service';
import { TicketService } from '../../services/ticket.service';
import { Noticia } from '../../models/noticia.model';
import { Ticket } from '../../models/ticket.model';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {NavSuperiorComponent} from "../../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../../nav-inferior/nav-inferior.component";

@Component({
  selector: 'app-detalle-noticia',
  templateUrl: './detalle-noticia.page.html',
  styleUrls: ['./detalle-noticia.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule,NavSuperiorComponent,NavInferiorComponent],
})
export class DetalleNoticiaPage implements OnInit {
  noticiaId: number | undefined;
  noticia: Noticia | undefined;
  ticket: Ticket | undefined;
  isLoading: boolean = true;
  isError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private noticiaService: NoticiaService,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const noticiaIdParam = params.get('noticiaId');
      this.noticiaId = noticiaIdParam ? +noticiaIdParam : 0;
      this.noticia = this.noticiaService.getNoticiaById(this.noticiaId);
      console.log('Noticia ID:', this.noticiaId);
      console.log('Noticia:', this.noticia);
      if (this.noticia) {
        this.ticket = this.ticketService.getTicketById(this.noticia.ticketId);
        console.log('Ticket Asociado:', this.ticket);
      }
      if (!this.noticia || !this.ticket) {
        this.isError = true;
        console.log('Error: Noticia o Ticket no encontrados.');
      }
      this.isLoading = false;
      console.log('isLoading:', this.isLoading);
      console.log('isError:', this.isError);
    });
  }
}
