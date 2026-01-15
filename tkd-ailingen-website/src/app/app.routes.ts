import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Taekwon-do Ailingen - Tradition, Disziplin, Stärke',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
