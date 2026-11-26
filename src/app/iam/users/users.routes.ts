import { Routes } from '@angular/router';
import { UsersPage } from './pages/users-page/users-page';
import { rolesResolver } from '../roles/resolvers/roles-resolver';
import { userResolver } from './resolvers/user-resolver';
import { permissionsResolver } from '../permissions/resolvers/permissions-resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    resolve: {
      roles: rolesResolver,
    },
    component: UsersPage,
  },
  {
    path: ':id',
    title: 'Detalle',
    resolve: {
      user: userResolver,
      permissions: permissionsResolver,
    },
    loadComponent: () => import('./pages/user-detail-page/user-detail-page'),
  },
];

export default routes;
