import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavSuperiorComponent } from "../../nav-superior/nav-superior.component";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    NavSuperiorComponent,
  ],
})
export class ChatPage implements OnInit {
  userId!: number;
  friend!: User;
  messages: Message[] = [];
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('userId');
      if (id) {
        this.userId = +id;
        const user = this.userService.getUserById(this.userId);
        if (user) {
          this.friend = user;
        } else {
          console.error('User not found with id:', this.userId);
        }
      }
    });

    this.messages = [
      { content: 'mensaje de amigo', type: 'friend' },
      { content: 'mensaje propio', type: 'self' },
    ];
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ content: this.newMessage, type: 'self' });
      setTimeout(() => {
        this.messages.push({ content: 'mensaje de amigo', type: 'friend' });
      }, 1000);
      this.newMessage = '';
    }
  }
}

interface Message {
  content: string;
  type: 'friend' | 'self';
}
