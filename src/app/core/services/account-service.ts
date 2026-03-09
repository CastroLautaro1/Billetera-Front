import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Account } from '../../shared/models/Account';
import { AccountPublicData } from '../../shared/models/AccountPublicData';

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

  getAccountPublicData(accountId : number) {
    return this.http.get<AccountPublicData>(`${this.API_URL}/data/${accountId}`);
  }
  
  // Obtiene informacion de la cuenta mediante el Alias o CVU
  getByDestination(destination: string) {
    return this.http.get<AccountPublicData>(`${this.API_URL}/search/${destination}`);
  }

  // Endpoint para actualizar solamente el alias
  updateAlias(alias: string) {
    const dto = {alias : alias}
    return this.http.put(`${this.API_URL}/alias`, dto);
  }

}
