import { Routes } from '@angular/router';
import { MainLayout } from './shared/layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./iam/auth/auth.routes'),
  },
  {
    path: '',
    component: MainLayout,
    children: [],
  },
];
