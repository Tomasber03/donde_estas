import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService, Notification } from '../services/notification.service';
import { Subscription } from 'rxjs';

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

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  navItems = [
    { label: 'Inicio', active: true },
    { label: 'Reportar Mascota', active: false },
    { label: 'Mis Reportes', active: false },
  ];
  redirectHome() {
    this.router.navigate(['/']);
  }
  

  ngOnInit() {
    this.checkAuthentication();
    this.notificationSubscription = this.notificationService.notification$.subscribe(notification => {
      this.notification = notification;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
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
    if (label === 'Inicio') {
      this.router.navigate(['/home']);
    } else if (label === 'Reportar Mascota') {
      this.router.navigate(['/crear-publicacion']);
    } else if (label === 'Mis Reportes') {
      this.router.navigate(['/mis-reportes']);
    } else if (label === 'Ranking') {
      this.router.navigate(['/ranking']);
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