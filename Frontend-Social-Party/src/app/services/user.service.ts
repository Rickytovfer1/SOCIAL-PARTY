import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: 1,
      name: 'Usuario 1',
      profileImage: 'assets/users/1.png',
      bio: 'bio de usuario 1',
      instagram: 'https://instagram.com/usuario1',
      tiktok: 'https://tiktok.com/usuario1',
      bereal: 'https://bere.al/usuario1'
    },
    {
      id: 2,
      name: 'Usuario 2',
      profileImage: 'assets/users/1.png',
      bio: 'bio de usuario 2',
      instagram: 'https://instagram.com/usuario2'
    },
    {
      id: 3,
      name: 'Usuario 3',
      profileImage: 'assets/users/1.png',
      bio: 'bio de usuario 3',
      tiktok: 'https://tiktok.com/@usuario3',
      bereal: 'https://bere.al/usuario3'
    }
  ];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

}
