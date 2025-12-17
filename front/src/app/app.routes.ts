import { Routes } from '@angular/router';
import { RegisterComponent } from './features/register/register.component';
import { DashboardComponent } from './features/home/dashboard.component';
import { DetallePublicacionComponent } from './features/publicationDetail/detalle-publicacion.component';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: DashboardComponent }, // Sin authGuard - acceso público
  { path: 'register', component: RegisterComponent },
  { path: 'publicacion/:id', component: DetallePublicacionComponent }, // Sin authGuard - acceso público
  { path: '**', redirectTo: '/home' }
];
