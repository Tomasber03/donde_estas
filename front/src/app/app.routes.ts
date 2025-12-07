import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { RegisterComponent } from './features/register/register.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path : 'register', component: RegisterComponent }
];
