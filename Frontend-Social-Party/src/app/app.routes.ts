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
        path: 'ver-eventos/:id',
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
        path: 'publicaciones-empresa',
        loadComponent: () => import('./publicaciones-empresa/publicaciones-empresa.component').then((m) => m.PublicacionesEmpresaComponent)
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
        path: 'chat/:id',
        loadComponent: () => import('./chat/chat.component').then((m) => m.ChatComponent)
    },
    {
        path: 'crear-publicacion-empresa',
        loadComponent: () => import('./crear-publicacion-empresa/crear-publicacion-empresa.component').then((m) => m.CrearPublicacionEmpresaComponent)
    },
    {
        path: 'crear-publicacion',
        loadComponent: () => import('./crear-publicacion/crear-publicacion.component').then((m) => m.CrearPublicacionComponent)
    },
    {
        path: 'ver-perfil-empresa',
        loadComponent: () => import('./ver-perfil-empresa/ver-perfil-empresa.component').then((m) => m.VerPerfilEmpresaComponent)
    },
    {
        path: 'ver-noticia/:id',
        loadComponent: () => import('./ver-noticia/ver-noticia.component').then((m) => m.VerNoticiaComponent)
    },
    {
        path: 'chat',
        loadComponent: () => import('./chat/chat.component').then((m) => m.ChatComponent)
    },
    {
        path: 'asistentes-evento-empresa',
        loadComponent: () => import('./asistentes-evento-empresa/asistentes-evento-empresa.component').then((m) => m.AsistentesEventoEmpresaComponent)
    },
    {
        path: 'perfil-empresa',
        loadComponent: () => import('./perfil-empresa/perfil-empresa.component').then((m) => m.PerfilEmpresaComponent)
    },
    {
        path: 'canjear-entrada-empresa',
        loadComponent: () => import('./canjear-entrada-empresa/canjear-entrada-empresa.component').then((m) => m.CanjearEntradaEmpresaComponent)
    },
    {
        path: 'ver-evento-info/:id',
        loadComponent: () => import('./ver-evento-info/ver-evento-info.component').then((m) => m.VerEventoInfoComponent)
    },
    {
        path: 'confirmacion-pago/:id',
        loadComponent: () => import('./confirmacion-pago/confirmacion-pago.component').then((m) => m.ConfirmacionPagoComponent)
    },
    {
        path: 'ver-solicitudes',
        loadComponent: () => import('./ver-solicitudes/ver-solicitudes.component').then((m) => m.VerSolicitudesComponent)
    },
    {
        path: 'ver-entradas',
        loadComponent: () => import('./ver-entradas/ver-entradas.component').then((m) => m.VerEntradasComponent)
    },
    {
        path: 'principal-admin',
        loadComponent: () => import('./principal-admin/principal-admin.component').then((m) => m.PrincipalAdminComponent)
    },
    {
        path: 'ver-info-admin/:id',
        loadComponent: () => import('./ver-info-admin/ver-info-admin.component').then((m) => m.VerInfoAdminComponent)
    },
    {
        path: 'banear-usuario',
        loadComponent: () => import('./banear-usuario/banear-usuario.component').then((m) => m.BanearUsuarioComponent)
    },
];
