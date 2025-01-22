// src/app/pages/event-details/event-details.page.ts
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Event } from '../../models/event.model';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink],
})
export class EventDetailsPage implements OnInit {
  ticketId: number | undefined;
  eventId: number | undefined;
  event: Event | undefined;
  isLoading: boolean = true;
  isError: boolean = false;

  constructor(private route: ActivatedRoute, private ticketService: TicketService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const ticketIdParam = params.get('ticketId');
      const eventIdParam = params.get('eventId');
      this.ticketId = ticketIdParam ? +ticketIdParam : 0;
      this.eventId = eventIdParam ? +eventIdParam : 0;
      this.event = this.ticketService.getEventById(this.ticketId, this.eventId);
      if (!this.event) {
        this.isError = true;
      }
      this.isLoading = false;
    });
  }
}
