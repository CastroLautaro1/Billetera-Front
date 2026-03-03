import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ThemeService } from '../../../core/services/theme-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-navbar-component',
  imports: [
    MatIcon, 
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger, 
    MatDivider],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {

  private _router = inject(Router);
  private _auth = inject(AuthService);

  themeService = inject(ThemeService);

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

  logout(){
    this._auth.logout();
    this._router.navigate(['auth'])
  }

  goHome() {
    this._router.navigate(['']);
  }

}
