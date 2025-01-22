import { Event } from './event.model';

export interface Ticket {
    id: number;
    title: string;
    description: string;
    image: string;
    events: Event[];
}
