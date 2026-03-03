import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../core/services/account-service';
import { filter, map, switchMap } from 'rxjs';
import { TransactionService } from '../../core/services/transaction-service';
import { TransactionDTO } from '../../shared/models/TransactionDTO';

@Component({
  selector: 'app-transfer-amount-component',
  imports: [MatIcon, MatIconButton],
  templateUrl: './transfer-amount-component.html',
  styleUrl: './transfer-amount-component.css',
})
export class TransferAmountComponent {
  private _route = inject(ActivatedRoute);
  private _account = inject(AccountService);
  private _transaction = inject(TransactionService);
  private _router = inject(Router);

  private accountId$ = this._route.paramMap.pipe(
    map(param => param.get('id')),
    map(id => id ? Number(id) : null),
    filter((id): id is number => id !== null)
  );

  counterpartyData = toSignal(
    this.accountId$.pipe(
      switchMap(id => this._account.getAccountPublicData(id)),
    ),
    { initialValue: undefined }
  );

  userAccount = toSignal(
    this._account.getProfile(),
    { initialValue : undefined }
  )
  
  // signals para el monto y los detalles
  rawAmount = signal<string>('');
  transferDetails = signal<string>('');

  // calcular el valor matematico real del monto
  amount = computed(() => {
    const val = this.rawAmount();
    return val ? Number(val) : null;
  });

  updateAmount(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // si el usuario pone mas de 2 decimales entonces se recorta
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1].length > 2) {
        value = `${parts[0]}.${parts[1].substring(0, 2)}`;
        input.value = value; 
      }
    }

    this.rawAmount.set(value);
  }

  updateDetails(event: Event) {
    const input = event.target as HTMLInputElement;
    this.transferDetails.set(input.value);
  }

  // computed para formatear como se ve el monto
  formattedAmount = computed(() => {
    const val = this.rawAmount();
    if (!val) return '$0';

    const parts = val.split('.');
    
    const integerPart = Number(parts[0]).toLocaleString('es-AR');

    if (parts.length > 1) {
      return `$${integerPart},${parts[1]}`;
    }
    
    return `$${integerPart}`;
  });

  // computed para saber si el monto ingresado es mayor que el saldo de la cuenta
  hasInsufficientFunds = computed(() => {
    const currentAmount = this.amount() || 0;
    const balance = this.userAccount()?.balance || 0;
    // true si se intenta manda mas de lo que tiene
    return currentAmount > balance; 
  });

  // valida que el monto sea mayor a 0 y no sea mayor que el saldo de la cuenta
  isValidTransfer = computed(() => {
    const currentAmount = this.amount() || 0;
    return currentAmount > 0 && !this.hasInsufficientFunds();
  });

  makeTransfer() {
    // doble validacion por si el html fue vulnerado
    if (!this.isValidTransfer) return;

    const destination = this.counterpartyData()?.cvu || this.counterpartyData()?.alias;

    if (!destination) {
      console.error("No se encontró el destinatario para la transferencia");
      return;
    }

    const dto : TransactionDTO = {
      destination: destination,
      amount: this.amount()!,
      details: this.transferDetails()
    }

    this._transaction.makeTransfer(dto).subscribe({
      next: (response) => {
        console.log("Transaccion completada: ", response);
        this._router.navigate(['receipt', response.id]);
      },
      error: (err) => {
        console.error("Error al realizar la transferencia: ", err);
      }
    })
  }

  goBack() {
    this._router.navigate(['transferContact']);
  }
}
