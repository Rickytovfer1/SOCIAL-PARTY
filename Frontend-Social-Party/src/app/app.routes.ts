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
  {
    path: 'perfil-asistente',
    loadComponent: () => import('./perfil-asistente/perfil-asistente.component').then((m) => m.PerfilAsistenteComponent)
  },
  {
    path: 'publicaciones',
    loadComponent: () => import('./publicaciones/publicaciones.component').then((m) => m.PublicacionesComponent)
  },
  {
    path: 'asistentes-evento',
    loadComponent: () => import('./asistentes-evento/asistentes-evento.component').then((m) => m.AsistentesEventoComponent)
  },
  {
    path: 'crear-evento-empresa',
    loadComponent: () => import('./crear-evento-empresa/crear-evento-empresa.component').then((m) => m.CrearEventoEmpresaComponent)
  },
  {
    path: 'crear-publicacion-empresa',
    loadComponent: () => import('./crear-publicacion-empresa/crear-publicacion-empresa.component').then((m) => m.CrearPublicacionEmpresaComponent)
  },
  {
    path: 'crear-publicacion',
    loadComponent: () => import('./crear-publicacion/crear-publicacion.component').then((m) => m.CrearPublicacionComponent)
  },
  // {
  //   path: 'chat',
  //   loadComponent: () => import('./chat/chat.component').then((m) => m.ChatComponent)
  // },
];
