import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ThemeService } from '../../../core/services/theme-service';

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

  themeService = inject(ThemeService);

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

  logout(){

  }

}
