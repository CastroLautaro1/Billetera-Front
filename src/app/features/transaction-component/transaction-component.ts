import { Component, inject } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TransactionService } from '../../core/services/transaction-service';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction-component',
  imports: [MatIcon, DatePipe],
  templateUrl: './transaction-component.html',
  styleUrl: './transaction-component.css',
})
export class TransactionComponent {
  private _transaction = inject(TransactionService);
  private _account = inject(AccountService);
  private _route = inject(ActivatedRoute);

  transactionId$ = this._route.paramMap.pipe(
    map(param => param.get('id')),
    map(id => id ? Number(id) : null),
    filter((id): id is number => id !== null)
  );

  transaction = toSignal(
    this.transactionId$.pipe(
      switchMap(id => this._transaction.getById(id))
    ),
    { initialValue : undefined }
  );

  originAccount = toSignal(
    toObservable(this.transaction).pipe(
      filter(tx => tx?.originAccountId !== undefined && tx.originAccountId !== null),
      switchMap(tx => this._account.getAccountPublicData(tx?.originAccountId!))
    ),
    { initialValue : undefined }
  );

  counterpartyAccount = toSignal(
    toObservable(this.transaction).pipe(
      filter(tx => tx?.counterpartyAccountId !== undefined && tx.counterpartyAccountId !== null),
      switchMap(tx => this._account.getAccountPublicData(tx?.counterpartyAccountId!))
    ),
    { initialValue : undefined }
  );

}
