import { Routes } from '@angular/router';
import {RegistroUsuarioComponent} from "./registro-usuario/registro-usuario.component";
import {RegistroEmpresaComponent} from "./registro-empresa/registro-empresa.component";
import {MenuPrincipalComponent} from "./menu-principal/menu-principal.component";

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
    path: 'app-menu-principal',
    loadComponent: () => import('./menu-principal/menu-principal.component').then((m) => m.MenuPrincipalComponent),
  },
  {
    path: 'app-nav-lateral',
    loadComponent: () => import('./nav-lateral/nav-lateral.component').then((m) => m.NavLateralComponent),
  },
  {
    path: 'app-pantalla-principal',
    loadComponent: () => import('./pantalla-principal/pantalla-principal.component').then((m) => m.PantallaPrincipalComponent),
  },
  {
    path: 'app-amigos',
    loadComponent: () => import('./amigos/amigos.component').then((m) => m.AmigosComponent),
  },
];
