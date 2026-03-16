import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const _auth = inject(AuthService);
  const _router = inject(Router);


  if (_auth.isLoggedIn()) {
    return true; 
  } else {
    _router.navigate(['/auth']); // Si no esta logueado lo mando a auth
    return false; 
  }
};
