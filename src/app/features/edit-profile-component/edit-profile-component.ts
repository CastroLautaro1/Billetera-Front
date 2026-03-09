import { Component, effect, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { UserService } from '../../core/services/user-service';
import { AccountService } from '../../core/services/account-service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { UpdateUserDTO } from '../../shared/models/UpdateUserDTO';
import { UpdatePasswordDTO } from '../../shared/models/UpdatePasswordDTO';

// Validado para comparar contraseñas
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const repeatPassword = control.get('repeatPassword');

  // Si existen y no son iguales, retornamos un error
  if (newPassword && repeatPassword && newPassword.value !== repeatPassword.value) {
    return { passwordsDontMatch: true };
  }
  return null;
};

@Component({
  selector: 'app-edit-profile-component',
  imports: [
    MatTabGroup, 
    MatTab, 
    MatIconModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './edit-profile-component.html',
  styleUrl: './edit-profile-component.css',
})
export class EditProfileComponent {
  private _user = inject(UserService);
  private _account = inject(AccountService);
  private _fb = inject(FormBuilder);

  userData = toSignal(
    this._user.getProfile(),
    { initialValue : undefined }
  );

  accountData = toSignal(
    this._account.getProfile(),
    { initialValue : undefined }
  );


  formData = this._fb.group({
    firstname: [this.userData()?.firstname,[Validators.required, Validators.minLength(2), Validators.minLength(50)]],
    lastname: [this.userData()?.lastname, [Validators.required, Validators.minLength(2), Validators.minLength(50)]],
    email: [this.userData()?.email, [Validators.email, Validators.required]],
    alias: [this.accountData()?.alias, [Validators.required, Validators.minLength(4), Validators.minLength(20)]]
  });

  formPassword = this._fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    repeatPassword: ['', [Validators.required]],
  }, {validators: passwordMatchValidator});

  constructor() {
    effect(() => {

      // Cuando los signals tengan datos relleno el formulario
      if(this.userData()) {
        this.formData.patchValue(
          {
            firstname: this.userData()?.firstname,
            lastname: this.userData()?.lastname,
            email: this.userData()?.email
          }
        );
      }

      if(this.accountData()) {
        this.formData.patchValue(
          {alias: this.accountData()?.alias}
        );
      }
    });
  }


  updateUser() {
    if(this.formData.invalid) return;

    const profileData: UpdateUserDTO = {
      firstname: this.formData.controls.firstname.value!,
      lastname: this.formData.controls.lastname.value!,
      email: this.formData.controls.email.value!
    };

    // Me aseguro de que algun campo haya cambiado
    if( profileData.firstname !== this.userData()?.firstname ||
      profileData.lastname !== this.userData()?.lastname ||
      profileData.email !== this.userData()?.email
    ) {
      this._user.updateProfile(profileData).subscribe({
        next: (data) => {
          console.log("Usuario actualizado", data);
        },
        error: err => console.error("Error al actualizar el usuario", err)
      });
    }

    const aliasForm = this.formData.controls.alias.value;

    // Si el alias cambió lo actualizo
    if(aliasForm !== this.accountData()?.alias) {
      this._account.updateAlias(aliasForm!).subscribe({
        next: () => {
          console.log("Alias actualizado correctamente");
        },
        error: err => console.error("Error al actualizar el alias", err)
      });
    }

  }

  updatePassword() {
    if(this.formPassword.invalid) {
      if(this.formPassword.hasError('passwordsDontMatch')) {
        console.error("Las contraseñas neuvas no coinciden")
      }
      return;
    }
    
    const passwordData: UpdatePasswordDTO = {
      password: this.formPassword.controls.password.value!,
      newPassword: this.formPassword.controls.newPassword.value!
    };

    this._user.updatePassword(passwordData).subscribe({
      next: () => {
        console.log("Contraseña actualizada correctamente")
      },
      error: err => console.log("Error al actualizar la contraseña", err)
    });
  }

  resetFormData() {
    this.formData.patchValue({
      firstname: this.userData()?.firstname,
      lastname: this.userData()?.lastname,
      email: this.userData()?.email,
      alias: this.accountData()?.alias
    });
  }

  resetFormPassword() {
    this.formPassword.reset;
  }
}
