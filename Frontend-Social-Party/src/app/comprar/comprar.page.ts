import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket.model';
import { Event } from '../models/event.model';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";

@Component({
  selector: 'app-comprar',
  templateUrl: './comprar.page.html',
  styleUrls: ['./comprar.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink, NavSuperiorComponent],
})
export class ComprarPage implements OnInit {
  ticketId: number | undefined;
  ticket: Ticket | undefined;
  mainEvent: Event | undefined;
  isLoading: boolean = true;
  isError: boolean = false;

  constructor(private route: ActivatedRoute, private ticketService: TicketService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.ticketId = id ? +id : 0;
      this.ticket = this.ticketService.getTicketById(this.ticketId);
      if (this.ticket && this.ticket.events && this.ticket.events.length > 0) {
        this.mainEvent = this.ticket.events[0];
      } else if (!this.ticket) {
        this.isError = true;
      }
      this.isLoading = false;
    });
  }
}
