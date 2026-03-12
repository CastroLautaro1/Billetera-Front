import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const strongPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  
  if (!value) return null;

  const errors: ValidationErrors = {};

  if (!/[A-Z]/.test(value)) {
    errors['missingUppercase'] = true; // Falta mayúscula
  }
  
  if (!/[0-9]/.test(value)) {
    errors['missingNumber'] = true; // Falta número
  }

  // Si el objeto errors tiene algo, lo devolvemos. Si está vacío, devolvemos null (es válido)
  return Object.keys(errors).length > 0 ? errors : null;
};

// Validacion para comparar contraseñas
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const repeatPassword = control.get('repeatPassword');

  // Si existen y no son iguales, retornamos un error
  if (newPassword && repeatPassword && newPassword.value !== repeatPassword.value) {
    return { passwordsDontMatch: true };
  }
  return null;
};