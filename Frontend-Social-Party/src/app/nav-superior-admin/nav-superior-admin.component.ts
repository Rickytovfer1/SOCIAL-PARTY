import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
    selector: 'app-nav-superior-admin',
    templateUrl: './nav-superior-admin.component.html',
    styleUrls: ['./nav-superior-admin.component.scss'],
    standalone: true,
    imports: [
        IonicModule
    ]
})
export class NavSuperiorAdminComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    irPrincipal() {
        this.router.navigate(['/principal-admin']);
    }

    cerrarSesion() {
        const token = "";
        sessionStorage.setItem("authToken", token);
        this.router.navigate(['/login']);
    }
}
