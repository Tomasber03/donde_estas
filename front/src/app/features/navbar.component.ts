import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  userName: string = '';
  showUserMenu: boolean = false;
  currentRoute: string = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  navItems = [
    { label: 'Inicio', route: '/home' },
    { label: 'Reportar Mascota', route: '/crear-publicacion' },
    { label: 'Mis Reportes', route: '/mis-reportes' },
  ];
  redirectHome() {
    this.router.navigate(['/']);
  }
  
  ngOnInit() {
    this.checkAuthentication();
    this.updateCurrentRoute();
    
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCurrentRoute();
    });
  }
  
  updateCurrentRoute() {
    this.currentRoute = this.router.url;
  }
  
  isActiveRoute(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
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

  handleNavClick(label: string) {
    console.log('handleNavClick llamado con:', label);
    const item = this.navItems.find(i => i.label === label);
    console.log('Item encontrado:', item);
    if (item) {
      console.log('Navegando a:', item.route);
      this.router.navigate([item.route]);
    } else {
      console.log('No se encontró el item para:', label);
    }
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