import { Routes } from '@angular/router';
import { UsersPage } from './pages/users-page/users-page';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UsersPage,
  },
];

export default routes;
