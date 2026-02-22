import { Component, computed, inject, input } from '@angular/core';
import { UserService } from '../../../core/services/user-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-fullname-component',
  imports: [],
  templateUrl: './user-fullname-component.html',
  styleUrl: './user-fullname-component.css',
})
export class UserFullnameComponent {
  private _user = inject(UserService);
  accountId = input<number>();

  name$ = toObservable(this.accountId).pipe(
    filter((accountId): accountId is number => !!accountId),
    switchMap(accountId => this._user.getFullname(accountId))
  );

  name = toSignal(this.name$, {initialValue : undefined});
}
