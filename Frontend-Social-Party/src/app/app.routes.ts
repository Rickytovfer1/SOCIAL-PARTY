import { Routes } from '@angular/router';

export const routes: Routes = [
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
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'amigos',
    loadComponent: () => import('./amigos/amigos.component').then((m) => m.AmigosComponent)
  },
  {
    path: 'registrar-cliente',
    loadComponent: () => import('./registrar-cliente/registrar-cliente.component').then((m) => m.RegistrarClienteComponent)
  },
  {
    path: 'registrar-empresa',
    loadComponent: () => import('./registrar-empresa/registrar-empresa.component').then((m) => m.RegistrarEmpresaComponent)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.component').then((m) => m.PerfilComponent)
  },
  {
    path: 'ver-eventos',
    loadComponent: () => import('./ver-eventos/ver-eventos.component').then((m) => m.VerEventosComponent)
  },
  {
    path: 'ver-empresas',
    loadComponent: () => import('./ver-empresas/ver-empresas.component').then((m) => m.VerEmpresasComponent)
  },
];
