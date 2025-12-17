import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(private router: Router) {}
  navItems = [
    { label: 'Inicio', active: true },
    { label: 'Reportar Mascota', active: false },
    { label: 'Mis Reportes', active: false },
  ];
  redirectHome() {
    this.router.navigate(['/']);
  }
}