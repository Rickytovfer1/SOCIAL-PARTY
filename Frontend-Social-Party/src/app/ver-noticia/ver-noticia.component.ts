import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {NavSuperiorComponent} from "../nav-superior/nav-superior.component";
import {NavInferiorComponent} from "../nav-inferior/nav-inferior.component";

@Component({
    selector: 'app-ver-noticia',
    templateUrl: './ver-noticia.component.html',
    styleUrls: ['./ver-noticia.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        NavSuperiorComponent,
        NavInferiorComponent
    ]
})
export class VerNoticiaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
