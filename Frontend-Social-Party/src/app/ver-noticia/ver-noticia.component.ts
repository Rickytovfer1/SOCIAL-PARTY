import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";

@Component({
    selector: 'app-ver-noticia',
    templateUrl: './ver-noticia.component.html',
    styleUrls: ['./ver-noticia.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent
    ]
})
export class VerNoticiaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
