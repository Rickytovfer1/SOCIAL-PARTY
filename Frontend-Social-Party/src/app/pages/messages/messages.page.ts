import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NavSuperiorComponent } from '../../nav-superior/nav-superior.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    NavSuperiorComponent,
  ],
})
export class MessagesPage implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.users = this.userService.getAllUsers();
    console.log('Users fetched:', this.users);
  }

  openChat(userId: number) {
    this.router.navigate(['/chat', userId]);
  }
}
