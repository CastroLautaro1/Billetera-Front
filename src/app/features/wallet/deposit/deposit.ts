import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction-service';

@Component({
  selector: 'app-deposit',
  imports: [FormsModule],
  templateUrl: './deposit.html',
  styleUrl: './deposit.css',
})
export class Deposit {

  private _transaction = inject(TransactionService);

  amount: number | null = null;
  isLoading = false;
  errorMessage = '';

  // En el futuro, este email lo sacarás de tu servicio de Autenticación (el usuario logueado)
  // Por ahora lo hardcodeamos con tu usuario de prueba para testear.
  userEmail = 'enzofernandez@gmail.com';

  onDeposit() {
    if (!this.amount || this.amount < 100) {
      this.errorMessage = 'El monto mínimo es de $100';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this._transaction.createDepositPreference(this.amount, this.userEmail).subscribe({
      next: (mercadopagoUrl) => {
        // 🚀 ¡Despegue! Redirigimos al navegador a la URL que nos dio el backend
        window.location.href = mercadopagoUrl;
      },
      error: (err) => {
        console.error('Error al generar el link:', err);
        this.errorMessage = 'Hubo un error al conectar con Mercado Pago.';
        this.isLoading = false;
      }
    });
  }

}
