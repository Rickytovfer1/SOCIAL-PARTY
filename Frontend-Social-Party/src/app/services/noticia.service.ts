import { Injectable } from '@angular/core';
import { Noticia } from '../models/noticia.model';

@Injectable({
  providedIn: 'root',
})
export class NoticiaService {
  private noticias: Noticia[] = [
    {
      id: 1,
      titulo: 'Evento de mafia',
      descripcion: 'descripcion de evento de mafia',
      imagen: 'assets/images/example.png',
      ticketId: 1,
    },
    {
      id: 2,
      titulo: 'Evento de Rosso',
      descripcion: 'descrpcion de evento de Rosso by Antique.',
      imagen: 'assets/images/example.png',
      ticketId: 2,
    },
    {
      id: 3,
      titulo: 'Evento 3',
      descripcion: 'descripcion evento 3',
      imagen: 'assets/images/example.png',
      ticketId: 3,
    },

  ];

  constructor() {}

  getNoticias(): Noticia[] {
    return this.noticias;
  }


  getNoticiaById(id: number): Noticia | undefined {
    return this.noticias.find(noticia => noticia.id === id);
  }

  getNoticiasByTicketId(ticketId: number): Noticia[] {
    return this.noticias.filter(noticia => noticia.ticketId === ticketId);
  }
}
