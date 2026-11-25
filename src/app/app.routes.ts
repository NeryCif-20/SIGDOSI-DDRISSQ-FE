import { Routes } from '@angular/router';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/public-guard';
import { permissionsResolver } from './iam/permissions/resolvers/permissions-resolver';

export const routes: Routes = [
  {
    path: 'auth',
    title: 'Auth',
    canMatch: [publicGuard],
    loadChildren: () => import('./iam/auth/auth.routes'),
  },
  {
    path: 'error',
    title: 'Error',
    loadComponent: () => import('./shared/pages/error-page/error-page'),
  },
  {
    path: '404',
    title: 'No encontrado',
    loadComponent: () => import('./shared/pages/error404-page/error404-page'),
  },
  {
    path: '',
    component: MainLayout,
    canMatch: [authGuard],
    children: [
      {
        path: 'permissions',
        title: 'Permisos',
        loadComponent: () => import('./iam/permissions/pages/permissions-page/permissions-page'),
      },
      {
        path: 'roles',
        title: 'Roles',
        resolve: {
          permissions: permissionsResolver,
        },
        loadComponent: () => import('./iam/roles/pages/roles-page/roles-page'),
      },
      {
        path: 'users',
        title: 'Usuarios',
        loadChildren: () => import('./iam/users/users.routes'),
      },
    ],
  },
];
