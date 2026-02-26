import { Component, computed, inject, input } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-contact-card-component',
  imports: [],
  templateUrl: './contact-card-component.html',
  styleUrl: './contact-card-component.css',
})
export class ContactCardComponent {
  private _account = inject(AccountService);
  accountId = input<number>();
  searchTerm = input<string>('');

  accountData$ = toObservable(this.accountId).pipe(
    filter((accountId): accountId is number => !!accountId),
    switchMap(accountId => this._account.getAccountPublicData(accountId))
  );

  accountData = toSignal(this.accountData$, {initialValue : undefined});

  /* Si el termino de busqueda que viene desde el padre coincide con el nombre
  de algun usuario entonces la tarjeta se muestra visible*/
  isVisible = computed(() => {
    const term = this.searchTerm().toLowerCase();

    if (!term) return true;

    const fullname = `${this.accountData()?.firstname} ${this.accountData()?.lastname}`.toLocaleLowerCase();
    // const alias = this.accountData()?.alias.toLocaleLowerCase || '';

    return fullname.includes(term);
  })

}
