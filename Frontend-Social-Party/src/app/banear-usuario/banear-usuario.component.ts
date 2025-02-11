import { Component, OnInit } from '@angular/core';
import {NavInferiorAdminComponent} from "../nav-inferior-admin/nav-inferior-admin.component";
import {NavSuperiorAdminComponent} from "../nav-superior-admin/nav-superior-admin.component";
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-banear-usuario',
    templateUrl: './banear-usuario.component.html',
    styleUrls: ['./banear-usuario.component.scss'],
    standalone: true,
    imports: [
        NavInferiorAdminComponent,
        NavSuperiorAdminComponent,
        IonicModule
    ]
})
export class BanearUsuarioComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}



}
