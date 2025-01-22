import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { Event } from '../models/event.model';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class TicketService {
    private tickets: Ticket[] = [
        {
            id: 1,
            title: 'Rosso by Antique',
            description: 'C/fresa n 8',
            image: 'assets/images/example.png',
            events: [
                {
                    id: 1,
                    title: 'Evento 1',
                    description: 'Evento 1',
                    image: 'assets/images/events/1.png',
                    date: new Date('2025-05-20'),
                    hours: '18:00 - 23:00',
                    attendees: [
                        { id: 1, name: 'Usuario 1', profileImage: 'assets/images/users/1.png', bio: 'Usuario 1' },
                        { id: 2, name: 'Usuario 2', profileImage: 'assets/images/users/1.png', bio: 'usuario 2' },
                    ],
                },
                {
                    id: 2,
                    title: 'Evento 2',
                    description: 'Evento 2',
                    image: 'assets/images/events/1.png',
                    date: new Date('2025-06-15'),
                    hours: '19:00 - 00:00',
                    attendees: [
                        { id: 3, name: 'Usuario 3', profileImage: 'assets/images/users/1.png', bio: 'Usuario 3' },
                        { id: 4, name: 'Usuario 4', profileImage: 'assets/images/users/1.png', bio: 'Usuario 4' },
                    ],
                },
            ],
        },
    ];

    constructor() {}

    getTickets(): Ticket[] {
        return this.tickets;
    }

    getTicketById(id: number): Ticket | undefined {
        return this.tickets.find(ticket => ticket.id === id);
    }

    getEventById(ticketId: number, eventId: number): Event | undefined {
        const ticket = this.getTicketById(ticketId);
        return ticket?.events.find(event => event.id === eventId);
    }
}
