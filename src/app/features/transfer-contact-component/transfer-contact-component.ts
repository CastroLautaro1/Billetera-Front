import { Component, computed, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TransactionService } from '../../core/services/transaction-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AccountService } from '../../core/services/account-service';
import { catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap } from 'rxjs';
import { ContactCardComponent } from '../contact-card-component/contact-card-component';
import { MatMenuTrigger } from "../../../../node_modules/@angular/material/menu/index";
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfer-contact-component',
  imports: [MatIcon, MatIconButton, ContactCardComponent],
  templateUrl: './transfer-contact-component.html',
  styleUrl: './transfer-contact-component.css',
})
export class TransferContactComponent {
  private _transaction = inject(TransactionService);
  private _account = inject(AccountService);
  private _router = inject(Router);
  searchQuery = signal<string>('');

  userAccount$ = this._account.getProfile();
  user = toSignal(this.userAccount$, {initialValue : undefined});

  recentContactIds = toSignal(
    this.userAccount$.pipe(
      switchMap(account =>{
        // Pido una pagina grande para obtener un rango amplio de transferencias
        return this._transaction.getHistory(0, 50).pipe(
          map(page => {
            const uniquesId = new Set<number>(); // Set para que no haya Ids duplicados

            page.content.forEach(t => {
              if(t.transactionType === 'TRANSFER') {
                const contactId = t.counterpartyAccountId === account.id
                                  ? t.originAccountId
                                  : t.counterpartyAccountId;
                if(contactId) {
                  uniquesId.add(contactId);
                }
              }
            });
            return Array.from(uniquesId) // Convierto al Set en un Array
          })
        )
      })
    ),
    {initialValue : []}
  )

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value.trim());
  }

  searchResult = toSignal(
    toObservable(this.searchQuery).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query => {
        if(!query) {
          return of(null);
        }

        return this._account.getByDestination(query).pipe(
          catchError(() => of(null))
        );

      })
    ),
    {initialValue : null}
  )

  goToAmount(accountId : number) {
    this._router.navigate(['/amount', accountId])
  }

  toHome() {
    this._router.navigate(['']);
  }

}
