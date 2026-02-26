import { Injectable, inject, signal, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // DOCUMENT para manipular el DOM
  private _document = inject(DOCUMENT);
  
  isDarkMode = signal<boolean>(false);

  constructor() {
    // Verificamos si el usuario ya tenia el modo oscuro guardado
    const savedTheme = localStorage.getItem('oran-theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
    }

    // El effect se ejecuta cada vez que el signal cambia
    effect(() => {
      if (this.isDarkMode()) {
        this._document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('oran-theme', 'dark');
      } else {
        this._document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('oran-theme', 'light');
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(actual => !actual);
  }
  
}
