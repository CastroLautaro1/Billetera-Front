import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../shared/models/User';
import { first, map } from 'rxjs';
import { UpdateUserDTO } from '../../shared/models/UpdateUserDTO';
import { UpdatePasswordDTO } from '../../shared/models/UpdatePasswordDTO';

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

  /* Seria mejor crear un DTO que solo tenga firstname y lastname en lugar de usar User directamente*/
  /* Obtiene el nombre completo del usuario segun su AccountId */  
  getFullname(accountId: number) {
    return this.http.get<User>(`${this.API_URL}/fullname/${accountId}`);
  }

  // Actualizar Usuario (nombre, apellido, email)
  updateProfile(dto: UpdateUserDTO) {
    return this.http.put(`${this.API_URL}/`, dto);
  }

  updatePassword(dto: UpdatePasswordDTO) {
    return this.http.put(`${this.API_URL}/password`, dto);
  }

}
