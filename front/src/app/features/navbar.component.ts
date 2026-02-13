import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService, Notification } from '../services/notification.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  userName: string = '';
  showUserMenu: boolean = false;
  notification: Notification | null = null;
  private notificationSubscription?: Subscription;
  private userUpdateSubscription?: Subscription;
  private routerSubscription?: Subscription;
  currentRoute: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
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
    console.log('NavbarComponent ngOnInit - Verificando autenticación');
    this.checkAuthentication();
    
    this.notificationSubscription = this.notificationService.notification$.subscribe(notification => {
      this.notification = notification;
      this.cdr.detectChanges();
    });
    
    this.userUpdateSubscription = this.authService.userUpdates$.subscribe(user => {
      if (user) {
        this.userName = user.nombre || 'Usuario';
        this.isAuthenticated = true;
      } else {
        this.userName = '';
        this.isAuthenticated = false;
      }
      this.cdr.detectChanges();
    });
    
    if (this.authService.isAuthenticated() && !this.authService.getCurrentUser()) {
      this.authService.loadCurrentUser().subscribe({
        error: (err) => console.error('Error al cargar usuario:', err)
      });
    }
    
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCurrentRoute();
    });
    
    this.updateCurrentRoute();
  }
@HostListener('window:focus')
  onWindowFocus(): void {
    this.authService.refreshCurrentUser().subscribe({
      error: (err) => console.error('Error al refrescar usuario:', err)
    });
  }
  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.userUpdateSubscription) {
      this.userUpdateSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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
      console.log('Usuario autenticado:', this.userName);
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