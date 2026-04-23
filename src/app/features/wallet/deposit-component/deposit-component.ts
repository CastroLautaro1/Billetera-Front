import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction-service';
import { MatDialogClose, MatDialogRef } from "@angular/material/dialog";
import { UserService } from '../../../core/services/user-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-deposit',
  imports: [FormsModule, MatIcon],
  templateUrl: './deposit-component.html',
  styleUrl: './deposit-component.css',
})
export class DepositComponent {

  private _transaction = inject(TransactionService);
  private _user = inject(UserService);
  private _dialogRef = inject(MatDialogRef<DepositComponent>);

  amount: number | null = null;
  isLoading = false;
  errorMessage = '';

  userEmail = toSignal(
    this._user.getProfile().pipe(
      map(u => u.email)
    ),
    { initialValue : undefined }
  );

  onDeposit() {
    const currentEmail = this.userEmail();

    if(!currentEmail) {
      this.errorMessage = "Aún estamos cargando tu perfil. Intentá en un segundo."
      return
    }

    if (!this.amount || this.amount < 100) {
      this.errorMessage = 'El monto mínimo es de $100';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this._transaction.createDepositPreference(this.amount, currentEmail).subscribe({
      next: (mercadopagoUrl) => {
        this._dialogRef.close();
        window.location.href = mercadopagoUrl;
      },
      error: (err) => {
        console.error('Error al generar el link:', err);
        this.errorMessage = 'Hubo un error al conectar con Mercado Pago.';
        this.isLoading = false;
      }
    });
  }

  cleanAmount() {
    this.amount = null;
    this.errorMessage = '';
  }

  closeModal() {
    console.log("Moro");
    this._dialogRef.close();
  }

}
