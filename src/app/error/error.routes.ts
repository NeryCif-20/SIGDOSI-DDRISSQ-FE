import { Routes } from '@angular/router';
import { ErrorLayout } from './layouts/error-layout/error-layout';

const routes: Routes = [
  {
    path: '',
    component: ErrorLayout,
    children: [
      {
        path: '404',
        title: 'No encontrado',
        loadComponent: () => import('./pages/error404-page/error404-page'),
      },
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/error-page/error-page'),
      },
    ],
  },
];

export default routes;
