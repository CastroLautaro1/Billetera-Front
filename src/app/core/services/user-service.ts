import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../shared/models/User';
import { first, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/user';

  /* Obtiene el nombre, apellido e email de el usuario logueado*/ 
  getProfile() {
    return this.http.get<User>(`${this.API_URL}/profile`);
  }

  getFullname(accountId: number) {
    return this.http.get<User>(`${this.API_URL}/data/${accountId}`);
  }

}
