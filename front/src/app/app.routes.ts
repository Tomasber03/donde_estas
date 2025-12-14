import { Routes } from '@angular/router';
import { RegisterComponent } from './features/register/register.component';
import { DashboardComponent } from './features/home/dashboard.component';
export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path : 'register', component: RegisterComponent },
  { path : '**', redirectTo: '' }
];
