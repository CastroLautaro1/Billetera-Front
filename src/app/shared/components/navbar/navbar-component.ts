import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-navbar-component',
  imports: [
    MatIcon, 
    MatMenu,
    MatMenuTrigger, 
    MatDivider],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {

  toggleDarkMode() {

  }

  logout(){

  }

}
