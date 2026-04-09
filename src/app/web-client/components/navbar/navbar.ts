import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppLogo } from '../../../shared/logo/logo';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MatButtonModule, MatIconModule, AppLogo],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isOpen = signal(false);

  constructor(private router: Router) {}

  toggleMenu() {
    this.isOpen.update(v => !v);
  }

  closeMenu() {
    this.isOpen.set(false);
  }

  navigate(route?: string, fragment?: string) {
    this.closeMenu();

    if (route) {
      this.router.navigate([route]);
    }

    if (fragment) {
      // delay to allow menu close animation (optional but smoother)
      setTimeout(() => {
        const el = document.getElementById(fragment);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
}
