import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Account } from '../../shared/models/Account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/account';

  /* Retorna la cuenta del usuario logueado*/ 
  getProfile() {
    return this.http.get<Account>(`${this.API_URL}/me`);
  }
  
}
