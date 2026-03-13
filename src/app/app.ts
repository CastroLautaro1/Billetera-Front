import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'billetera_front';
  private _router = inject(Router);
  
  // Si se esta en /auth oculto el navbar
  isAuthPage() {
    return this._router.url === '/auth';
  }
}
