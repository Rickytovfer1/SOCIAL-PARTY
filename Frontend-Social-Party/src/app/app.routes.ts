import {Routes} from '@angular/router';

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
        path: 'crear-publicacion',
        loadComponent: () => import('./crear-publicacion/crear-publicacion.component').then((m) => m.CrearPublicacionComponent)
    },
    {
        path: 'crear-publicacion-empresa',
        loadComponent: () => import('./crear-publicacion-empresa/crear-publicacion-empresa.component').then((m) => m.CrearPublicacionEmpresaComponent)
    },
    {
        path: 'crear-evento-empresa',
        loadComponent: () => import('./crear-evento-empresa/crear-evento-empresa.component').then((m) => m.CrearEventoEmpresaComponent)
    },
];
