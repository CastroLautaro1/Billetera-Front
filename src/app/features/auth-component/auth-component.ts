import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../shared/models/Login';
import { Register } from '../../shared/models/Register';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-auth-component',
  imports: [
    ReactiveFormsModule,
    MatIcon
  ],
  templateUrl: './auth-component.html',
  styleUrl: './auth-component.css',
})
export class AuthComponent {
  private _auth = inject(AuthService);
  private _router = inject(Router);
  private _form = inject(FormBuilder);
  isLoginMode = true;
  hidePasswordLogin = signal(true);
  hidePasswordRegister = signal(true);

  loginForm = this._form.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
  });

  registerForm = this._form.group({
    firstname: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
  });

  submit() {
    // Si esta en modo Login entra al if
    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        const login: Login = {
          email: this.loginForm.value.email || '',
          password: this.loginForm.value.password || '',
        };

        this._auth.login(login).subscribe({
          next: (response) => {
            console.log('Login exitoso ', response);
            this._router.navigate(['']);
          },
          error: (e) => console.error('Error al iniciar sesion ', e),
        });
      }
    }
    else { // Si el modo no es Login, entra al else
      if (this.registerForm.valid) {
        const register : Register = {
          firstname: this.registerForm.value.firstname || '',
          lastname: this.registerForm.value.lastname || '',
          email: this.registerForm.value.email || '',
          password: this.registerForm.value.password || ''
        }

        this._auth.register(register).subscribe({
          next: (response) => {
            console.log("Registro exitoso"),
            this.isLoginMode = true
          },
          error: e => console.error("Error al registrarse ", e)
        })
      }
    }
  }

  // Devuelve el formulario actual, ya sea el de login o register
  get currentForm(): FormGroup {
    return (this.isLoginMode ? this.loginForm : this.registerForm) as FormGroup;
  }

  // Getters para acceder a los campos email y password del form actual
  get emailControl(): AbstractControl | null {
    return this.currentForm.get('email');
  }

  get passwordControl(): AbstractControl | null {
    return this.currentForm.get('password');
  }

}
