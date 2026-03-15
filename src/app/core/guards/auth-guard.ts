import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  // En los guards funcionales usamos inject() en lugar del constructor
  const _auth = inject(AuthService);
  const _router = inject(Router);

  // Verificamos si el usuario tiene un token válido
  if (_auth.isLoggedIn()) {
    return true; // ¡Adelante! Tiene permiso para entrar a la ruta
  } else {
    // No está logueado o el token expiró. Lo mandamos a la pantalla de Login
    _router.navigate(['/auth']);
    return false; // Bloqueamos el acceso a la ruta solicitada
  }
};
