import { Injectable } from '@angular/core';
import { Noticia } from '../models/noticia.model';

@Injectable({
  providedIn: 'root',
})
export class NoticiaService {
  private noticias: Noticia[] = [
    {
      id: 1,
      titulo: 'Evento de Rosso by Antique',
      descripcion: 'Descripcion de Rosso',
      imagen: 'assets/images/example.png',
      ticketId: 1,
    },
    {
      id: 2,
      titulo: 'Evento de Maffia the club',
      descripcion: 'Descripcion de Maffia the club',
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
