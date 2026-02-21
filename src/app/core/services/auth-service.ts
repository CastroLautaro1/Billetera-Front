import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Login } from '../../shared/models/Login';
import { Register } from '../../shared/models/Register';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/auth';


  login(credentials: Login) {
    return this.http.post(`${this.API_URL}/login`, credentials, { responseType: 'text' }).pipe(
      tap(response => {
        localStorage.setItem('token', response);
      })
    )
  }

  register(data: Register) {
    return this.http.post(`${this.API_URL}/register`, data, { responseType: 'text' });
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

}
