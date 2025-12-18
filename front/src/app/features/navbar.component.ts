import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  navItems = [
    { label: 'Inicio', active: true },
    { label: 'Reportar Mascota', active: false },
    { label: 'Mis Reportes', active: false },
  ];

  isAuthenticated: boolean = false;
  userName: string = '';
  showUserMenu: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAuthentication();
  }

  checkAuthentication() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      const user = this.authService.getCurrentUser();
      this.userName = user?.nombre || 'Usuario';
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.showUserMenu = false;
    this.router.navigate(['/profile']);
  }

  logout() {
    this.showUserMenu = false;
    this.authService.logout();
    this.checkAuthentication();
  }
}