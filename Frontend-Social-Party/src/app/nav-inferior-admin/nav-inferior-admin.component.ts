import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
    selector: 'app-nav-inferior-admin',
    templateUrl: './nav-inferior-admin.component.html',
    styleUrls: ['./nav-inferior-admin.component.scss'],
    standalone: true,
    imports: [
        IonicModule
    ]
})
export class NavInferiorAdminComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

    irPrincipal() {
        this.router.navigate(['/principal-admin']);
    }
}
