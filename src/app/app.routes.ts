import { Routes } from '@angular/router';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent, NbResetPasswordComponent
} from '@nebular/auth';
import {LayoutComponent} from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
      },
      {
        path: 'login',
        component: NbLoginComponent,
      },
      {
        path: 'register',
        component: NbRegisterComponent,
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ]
  },
  {
    path: '',
    // canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'salon',
        pathMatch: 'full'
      },
      {
        path: 'salon',
        loadComponent: () => import('./components/page/salon/salon.component').then(m => m.SalonComponent)
      },
      // {
      //   path: 'pedidos',
      //   children: [
      //     {
      //       path: 'nuevo',
      //       loadComponent: () => import('./pages/pedidos/nuevo-pedido/nuevo-pedido.component').then(m => m.NuevoPedidoComponent)
      //     },
      //     {
      //       path: 'activos',
      //       loadComponent: () => import('./pages/pedidos/pedidos-activos/pedidos-activos.component').then(m => m.PedidosActivosComponent)
      //     },
      //     {
      //       path: 'historial',
      //       loadComponent: () => import('./pages/pedidos/historial-pedidos/historial-pedidos.component').then(m => m.HistorialPedidosComponent)
      //     }
      //   ]
      // },
      // {
      //   path: 'menu',
      //   loadComponent: () => import('./pages/menu/menu.component').then(m => m.MenuComponent)
      // },
      // {
      //   path: 'caja',
      //   children: [
      //     {
      //       path: 'cuenta',
      //       loadComponent: () => import('./pages/caja/generar-cuenta/generar-cuenta.component').then(m => m.GenerarCuentaComponent)
      //     },
      //     {
      //       path: 'cobrar',
      //       loadComponent: () => import('./pages/caja/cobrar/cobrar.component').then(m => m.CobrarComponent)
      //     }
      //   ]
      // },
      // {
      //   path: 'comunicacion',
      //   loadComponent: () => import('./pages/comunicacion/comunicacion.component').then(m => m.ComunicacionComponent)
      // }
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
