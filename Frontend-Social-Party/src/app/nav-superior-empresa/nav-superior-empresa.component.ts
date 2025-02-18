import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
    selector: 'app-nav-superior-empresa',
    templateUrl: './nav-superior-empresa.component.html',
    styleUrls: ['./nav-superior-empresa.component.scss'],
    standalone: true,
    imports: [
        IonicModule
    ]
})
export class NavSuperiorEmpresaComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

    cerrarSesion() {
        sessionStorage.clear();
        this.router.navigate(['/login']);
    }

}
