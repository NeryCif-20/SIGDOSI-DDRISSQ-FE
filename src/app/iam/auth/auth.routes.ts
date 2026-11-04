import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { LoginPage } from './pages/login-page/login-page';

const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: LoginPage,
        title: 'Inicio de sesión',
      },
      {
        path: 'setup-password',
        loadComponent: () => import('./pages/setup-password-page/setup-password-page'),
        title: 'Configuracion de contraseña',
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
];

export default routes;
