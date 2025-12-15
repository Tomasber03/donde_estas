import { Routes } from '@angular/router';
import { RegisterComponent } from './features/register/register.component';
import { DashboardComponent } from './features/home/dashboard.component';
import { DetallePublicacionComponent } from './features/publicationDetail/detalle-publicacion.component';
export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path : 'register', component: RegisterComponent },
  { path : 'publicacion/:id', component: DetallePublicacionComponent },
  { path : '**', redirectTo: '' }
];
