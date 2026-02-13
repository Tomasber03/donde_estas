import { Routes } from '@angular/router';
import { RegisterComponent } from './features/register/register.component';
import { DashboardComponent } from './features/home/dashboard.component';
import { DetallePublicacionComponent } from './features/publicationDetail/detalle-publicacion.component';
import { LoginComponent } from './features/login/login.component';
import { ProfileComponent } from './features/profile/profile.component';
import { CreatePublicationComponent } from './features/createPublication/create-publication.component';
import { EditPublicationComponent } from './features/editPublication/edit-publication.component';
import { EditarMascotaComponent } from './features/editarMascota/editar-mascota.component';
import { AvistamientoComponent } from './features/avistamiento/avistamiento.component';
import { DetalleAvistamientoComponent } from './features/avistamiento/detalleAvistamiento.component';
import { MisPublicacionesComponent } from './features/misPublicaciones/mis-publicaciones.component';
import { AdminPanelComponent } from './features/admin/admin-panel.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: DashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'mis-reportes', component: MisPublicacionesComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [adminGuard] },
  { path: 'publicacion/:id', component: DetallePublicacionComponent },
  { path: 'crear-publicacion', component: CreatePublicationComponent, canActivate: [authGuard] },
  { path: 'editar-publicacion/:id', component: EditPublicationComponent, canActivate: [authGuard] },
  { path: 'editar-mascota/:id', component: EditarMascotaComponent, canActivate: [authGuard] },
  { path: 'avistamiento', component: AvistamientoComponent },
  { path: 'avistamiento/:id', component: DetalleAvistamientoComponent },
  { path: '**', redirectTo: '/home' }
];
