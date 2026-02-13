import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { NavbarComponent } from './features/navbar.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html'
})
export class App {
  router = inject(Router);
  protected readonly title = signal('Pet Finder');
}
