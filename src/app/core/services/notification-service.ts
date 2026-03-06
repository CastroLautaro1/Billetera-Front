import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../shared/components/custom-snackbar-component/custom-snackbar-component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  
  constructor(private snackBar: MatSnackBar) {}

  success(message: string) {
    this.show(message, 'check_circle', 'snack-success');
  }

  error(message: string) {
    this.show(message, 'error', 'snack-error');
  }

  info(message: string) {
    this.show(message, 'info', 'snack-info');
  }

  // El método privado que hace el trabajo pesado para no repetir código
  private show(message: string, icon: string, panelClass: string) {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['oran-snackbar', panelClass], // Pasamos la clase base y la del color
      data: { message, icon }
    });
  }

}
