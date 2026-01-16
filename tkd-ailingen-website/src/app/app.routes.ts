import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Imprint } from './pages/imprint/imprint';
import { Disclaimer } from './pages/disclaimer/disclaimer';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { YouthProtection } from './pages/youth-protection/youth-protection';

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
    path: 'haftungsausschluss',
    component: Disclaimer,
    title: 'Haftungsausschluss - Taekwon-do Ailingen e.V.',
  },
  {
    path: 'disclaimer',
    redirectTo: 'haftungsausschluss',
    pathMatch: 'full',
  },
  {
    path: 'datenschutz',
    component: PrivacyPolicy,
    title: 'Datenschutzerklärung - Taekwon-do Ailingen e.V.',
  },
  {
    path: 'privacy',
    redirectTo: 'datenschutz',
    pathMatch: 'full',
  },
  {
    path: 'jugendschutz',
    component: YouthProtection,
    title: 'Jugendschutz - Taekwon-do Ailingen e.V.',
  },
  {
    path: 'youth-protection',
    redirectTo: 'jugendschutz',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
