import { Routes } from '@angular/router';
import { RegisterComponent } from './features/register/register.component';
import { DashboardComponent } from './features/home/dashboard.component';
import { DetallePublicacionComponent } from './features/publicationDetail/detalle-publicacion.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
   { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'publicacion/:id', component: DetallePublicacionComponent },
  { path: '**', redirectTo: '/login' }
];
