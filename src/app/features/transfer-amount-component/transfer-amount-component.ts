import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../core/services/account-service';
import { filter, map, switchMap } from 'rxjs';
import { TransactionService } from '../../core/services/transaction-service';
import { TransactionDTO } from '../../shared/models/TransactionDTO';
import { NotificationService } from '../../core/services/notification-service';

@Component({
  selector: 'app-transfer-amount-component',
  imports: [MatIcon, MatIconButton, RouterLink],
  templateUrl: './transfer-amount-component.html',
  styleUrl: './transfer-amount-component.css',
})
export class TransferAmountComponent {
  private _route = inject(ActivatedRoute);
  private _account = inject(AccountService);
  private _transaction = inject(TransactionService);
  private _router = inject(Router);
  private _notify = inject(NotificationService);

  private currentIdempotencyKey: string = '';
  isSubmitting = signal(false); 

  ngOnInit() {
    this.currentIdempotencyKey = crypto.randomUUID();
  }

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

  predefinedDetails: string[] = ['Varios','Compra','Comida', 'Alquiler', 'Servicios', 'Regalos', 'Deudas'];

  selectedDetail: string = '';

  selectDetail(detail: string) {
    if (this.selectedDetail === detail) {
      this.selectedDetail = ''; // Lo deselecciona
    } else {
      this.selectedDetail = detail; // Lo selecciona
    }
  }
  
  // signal para el monto 
  rawAmount = signal<string>('');

  // calcular el valor matematico real del monto
  amount = computed(() => {
    const val = this.rawAmount();
    return val ? Number(val) : null;
  });

  updateAmount(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // 3. Si tiene más de 9 caracteres, lo cortamos "a la fuerza"
    if (value.length > 9) {
      value = value.slice(0, 9);
      input.value = value; // Actualizamos lo que ve el usuario en pantalla
    }

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
    if (!this.isValidTransfer || this.isSubmitting()) return;

    const destination = this.counterpartyData()?.cvu || this.counterpartyData()?.alias;

    if (!destination) {
      console.error("No se encontró el destinatario para la transferencia");
      return;
    }

    const dto : TransactionDTO = {
      destination: destination,
      amount: this.amount()!,
      details: this.selectedDetail
    }

    if(!this.currentIdempotencyKey) {
      this.currentIdempotencyKey = crypto.randomUUID(); // Vuelvo a generar la clave por las dudas
    }

    this.isSubmitting.set(true);

    this._transaction.makeTransfer(dto, this.currentIdempotencyKey).subscribe({
      next: (response) => {
        console.log("Transaccion completada: ", response);
        this._router.navigate(['transfer-success', response.id], { replaceUrl : true });
      },
      error: (err) => {
        console.error("Error al realizar la transferencia: ", err);
        this.isSubmitting.set(false);
        this._notify.error(err.error.message);
      }
    })
  }
}
