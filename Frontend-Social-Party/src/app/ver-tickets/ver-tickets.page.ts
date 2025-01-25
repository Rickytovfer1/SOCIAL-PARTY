import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from "@angular/router";
import { NavSuperiorComponent } from "../nav-superior/nav-superior.component";
import { NavInferiorComponent } from "../nav-inferior/nav-inferior.component";
import { NavLateralComponent } from "../nav-lateral/nav-lateral.component";
import { Ticket } from '../models/ticket.model';

@Component({
  selector: 'app-ver-tickets',
  templateUrl: './ver-tickets.page.html',
  styleUrls: ['./ver-tickets.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLink, NavSuperiorComponent, NavInferiorComponent, NavLateralComponent],
})
export class VerTicketsPage implements OnInit {
  searchTerm: string = '';
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];

  constructor() {}

  ngOnInit() {
    this.tickets = [
      {
        id: 1,
        title: 'Rosso by Antique',
        description: 'C/fresa n 8',
        image: 'assets/images/example.png',
        events: []
      },
      {
        id: 2,
        title: 'Mafia The Club',
        description: 'C/ Calatrava Nº 8',
        image: 'assets/images/example.png',
        events: []
      },
      {
        id: 3,
        title: 'Occo',
        description: 'C/ Sevilla Nº 8',
        image: 'assets/images/example.png',
        events: []
      },
    ];
    this.filteredTickets = this.tickets;
  }

  onSearchChange(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredTickets = this.tickets.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query)
    );
  }
}
