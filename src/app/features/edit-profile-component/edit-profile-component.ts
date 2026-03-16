import { Component, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { UserService } from '../../core/services/user-service';
import { AccountService } from '../../core/services/account-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { UpdateUserDTO } from '../../shared/models/UpdateUserDTO';
import { UpdatePasswordDTO } from '../../shared/models/UpdatePasswordDTO';
import { strongPasswordValidator, passwordMatchValidator } from '../../core/validators/custom-validators';


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

  hidePassword = signal(true);
  hideNewPassword = signal(true);

  userData = toSignal(
    this._user.getProfile(),
    { initialValue : undefined }
  );

  accountData = toSignal(
    this._account.getProfile(),
    { initialValue : undefined }
  );


  formData = this._fb.group({
    firstname: [this.userData()?.firstname,[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastname: [this.userData()?.lastname, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: [this.userData()?.email, [Validators.required, Validators.email]],
    alias: [this.accountData()?.alias, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]]
  });

  formPassword = this._fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8), strongPasswordValidator]],
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
        console.log("Contraseña actualizada correctamente: ", passwordData.newPassword)
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
    this.formPassword.reset();
  }
}
