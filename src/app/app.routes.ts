import type { Routes } from '@angular/router';
import { Projects } from './projects/projects';
import { Shotlist } from './shotlist/shotlist';
import { Privacy } from './privacy/privacy';
import { Disclaimer } from './disclaimer/disclaimer';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  { path: 'projects', component: Projects },
  { path: 'shotlist/:id', component: Shotlist },
  { path: 'privacy', component: Privacy },
  { path: 'disclaimer', component: Disclaimer },
  { path: '**', redirectTo: 'projects' },
];
