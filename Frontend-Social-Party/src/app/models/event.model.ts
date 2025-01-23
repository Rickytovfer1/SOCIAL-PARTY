import { User } from './user.model';

export interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  date: Date;
  hours: string;
  attendees: User[];
}
