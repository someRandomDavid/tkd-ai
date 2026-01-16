import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Imprint } from './pages/imprint/imprint';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Taekwon-do Ailingen e.V. - Tradition, Disziplin, Stärke',
  },
  {
    path: 'impressum',
    component: Imprint,
    title: 'Impressum - Taekwon-do Ailingen e.V.',
  },
  {
    path: 'imprint',
    redirectTo: 'impressum',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
