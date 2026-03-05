import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AccountService } from '../../core/services/account-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../core/services/user-service';
import { TransactionService } from '../../core/services/transaction-service';
import { MatMenuTrigger } from "../../../../node_modules/@angular/material/menu/index";
import { DatePipe } from '@angular/common';
import { map, tap } from 'rxjs';
import { UserFullnameComponent } from '../../shared/components/user-fullname-component/user-fullname-component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-component',
  imports: [MatIcon, DatePipe, UserFullnameComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  private _account = inject(AccountService);
  private _user = inject(UserService);
  private _transaction = inject(TransactionService);
  private _router = inject(Router);

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

  toTransfer() {
    this._router.navigate(['transferContact']);
  }

  goHistory() {
    this._router.navigate(['history']);
  }

}
