import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Taekwon-do Ailingen e.V. - Tradition, Disziplin, Stärke',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
