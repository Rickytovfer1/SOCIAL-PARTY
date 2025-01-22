import { Routes } from '@angular/router';
import { RegistroUsuarioComponent } from "./registro-usuario/registro-usuario.component";
import { RegistroEmpresaComponent } from "./registro-empresa/registro-empresa.component";
import { PersonProfilePage } from "./pages/person-profile/person-profile.page";
import { EventDetailsPage } from "./pages/event-details/event-details.component";
import { ComprarPage } from "./comprar/comprar.page";
import { NoticiasPage } from './pages/noticias/noticias.page';
import { DetalleNoticiaPage } from './pages/detalle-noticia/detalle-noticia.page';

export const routes: Routes = [
  { path: 'comprar', component: ComprarPage },
  { path: 'event-details/:ticketId/:eventId', component: EventDetailsPage },
  { path: 'person-profile/:userId', component: PersonProfilePage },
  { path: 'detalle-noticia/:noticiaId', component: DetalleNoticiaPage },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'app-registro-usuario',
    loadComponent: () => import('./registro-usuario/registro-usuario.component').then((m) => m.RegistroUsuarioComponent),
  },
  {
    path: 'app-registro-empresa',
    loadComponent: () => import('./registro-empresa/registro-empresa.component').then((m) => m.RegistroEmpresaComponent),
  },
  {
    path: 'app-login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'app-nav-superior',
    loadComponent: () => import('./nav-superior/nav-superior.component').then((m) => m.NavSuperiorComponent),
  },
  {
    path: 'app-nav-inferior',
    loadComponent: () => import('./nav-inferior/nav-inferior.component').then((m) => m.NavInferiorComponent),
  },
  {
    path: 'app-perfil',
    loadComponent: () => import('./perfil/perfil.component').then((m) => m.PerfilComponent),
  },
  {
    path: 'app-ver-tickets',
    loadComponent: () => import('./ver-tickets/ver-tickets.page').then(m => m.VerTicketsPage)
  },
  {
    path: 'comprar/:id',
    loadComponent: () => import('./comprar/comprar.page').then(m => m.ComprarPage)
  },
  {
    path: 'noticias',
    component: NoticiasPage,
  },

  { path: '**', redirectTo: 'ver-tickets' },
];
