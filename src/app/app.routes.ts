import { Routes } from '@angular/router';
import { Projects } from './projects/projects';
import { Shotlist } from './shotlist/shotlist';

export const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  { path: 'projects', component: Projects },
  { path: 'shotlist/:id', component: Shotlist },
];
