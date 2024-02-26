import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SmiteComponent } from './components/smite/smite.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'smite', component: SmiteComponent
  }
];
