import { Routes } from '@angular/router';
import { WebClient } from './web-client/web-client';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Pricing } from './pricing/pricing';
import { About } from './about/about';
import { authGuard, publicGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: WebClient },
  { path: 'login', component: Login, canActivate: [publicGuard] },
  { path: 'dashboard', redirectTo: 'dashboard/overview', pathMatch: 'full' },
  { path: 'dashboard/:section', component: Dashboard, canActivate: [authGuard] },
  { path: 'pricing', component: Pricing },
  { path: 'about', component: About },
  { path: '**', redirectTo: '' },
];
