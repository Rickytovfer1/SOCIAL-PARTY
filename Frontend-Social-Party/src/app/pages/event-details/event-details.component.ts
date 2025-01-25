import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Event } from '../../models/event.model';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavSuperiorComponent } from '../../nav-superior/nav-superior.component';
import { NavLateralComponent } from '../../nav-lateral/nav-lateral.component';
import { NavInferiorComponent } from '../../nav-inferior/nav-inferior.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    NavSuperiorComponent,
    RouterLink,
    NavLateralComponent,
    NavInferiorComponent
  ]
})
export class EventDetailsPage implements OnInit {
  ticketId: number | undefined;
  eventId: number | undefined;
  event: Event | undefined;
  isLoading = true;
  isError = false;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private userService: UserService
  ) {}

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

  getInitial(id: number): string {
    const user = this.userService.getUserById(id);
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return '?';
  }
}
