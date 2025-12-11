import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  navItems = [
    { label: 'Inicio', active: true },
    { label: 'Reportar Mascota', active: false },
    { label: 'Mis Reportes', active: false },
    { label: 'Ranking', active: false }
  ];
}