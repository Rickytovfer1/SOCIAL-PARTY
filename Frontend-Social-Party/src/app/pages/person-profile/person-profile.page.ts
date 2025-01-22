import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Location } from '@angular/common';
import {NavSuperiorComponent} from "../../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../../nav-inferior/nav-inferior.component";

@Component({
  selector: 'app-person-profile',
  templateUrl: './person-profile.page.html',
  styleUrls: ['./person-profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule,NavSuperiorComponent,NavInferiorComponent],
})
export class PersonProfilePage implements OnInit {
  userId: number | undefined;
  user: User | undefined;
  isLoading: boolean = true;
  isError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userIdParam = params.get('userId');
      this.userId = userIdParam ? +userIdParam : 0;
      this.user = this.userService.getUserById(this.userId);
      console.log('User ID:', this.userId);
      console.log('User:', this.user);
      if (!this.user) {
        this.isError = true;
      }
      this.isLoading = false;
    });
  }

}
