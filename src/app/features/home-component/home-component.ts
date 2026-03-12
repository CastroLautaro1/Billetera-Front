import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AccountService } from '../../core/services/account-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../core/services/user-service';
import { TransactionService } from '../../core/services/transaction-service';
import { CommonModule, DatePipe } from '@angular/common';
import { UserFullnameComponent } from '../../shared/components/user-fullname-component/user-fullname-component';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent } from '../user-modal-component/user-modal-component';

@Component({
  selector: 'app-home-component',
  imports: [MatIcon, DatePipe, UserFullnameComponent, CommonModule, RouterLink],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  private _account = inject(AccountService);
  private _user = inject(UserService);
  private _transaction = inject(TransactionService);
  private _router = inject(Router);
  private _dialog = inject(MatDialog);
  amountVisible = true;

  userAccount = toSignal(
    this._account.getProfile(),
    {initialValue : undefined}
  );

  userData = toSignal(
    this._user.getProfile(),
    {initialValue : undefined}
  )

  transactionHistory = toSignal(
    this._transaction.getHistory(0, 3),
    {initialValue : undefined}
  )

  // Metodo para determinar si una transaccion es un ingreso o egreso
  isEntry(t: any): boolean {
    if (t.transactionType === 'DEPOSIT') return true;

    return t.transactionType === 'TRANSFER' && t.counterpartyAccountId === this.userAccount()?.id;
  }

  openUserModal() {
    this._dialog.open(UserModalComponent, {
      width: '450px',          
      panelClass: 'custom-modal-container', 
      autoFocus: false
    })
  }

  toggleAmount() {
    this.amountVisible = !this.amountVisible;
  }

}
