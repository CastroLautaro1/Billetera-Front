import { Component, inject, signal } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { TransactionService } from '../../core/services/transaction-service';
import { Transaction } from '../../shared/models/Transaction';
import { CommonModule } from '@angular/common';
import { UserFullnameComponent } from '../../shared/components/user-fullname-component/user-fullname-component';
import { AccountService } from '../../core/services/account-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-history-component',
  imports: [
    MatPaginatorModule,
    ReactiveFormsModule,
    MatIcon,
    CommonModule,
    UserFullnameComponent
  ],
  providers: [{
    provide: MAT_DATE_LOCALE, useValue: 'es-AR'
  }],
  templateUrl: './history-component.html',
  styleUrl: './history-component.css',
})
export class HistoryComponent {

  private _transaction = inject(TransactionService);
  private _userAccount = inject(AccountService);
  private _fb = inject(FormBuilder);
  private _router = inject(Router);

  searchControl = new FormControl('');

  isFiltersOpen = false;

  transactions = signal<Transaction[]>([]);
  totalElements = signal<number>(0);
  currentPage = 0;
  pageSize = 10;

  // Obtengo el Id de la cuenta del usuario logueado para saber cuando es destinatario y cuando remitente
  userAccount = toSignal(
      this._userAccount.getProfile(),
      {initialValue : undefined}
  );

  filterForm = this._fb.group({
    minAmount: [null, [Validators.min(0)]],
    maxAmount: [null, [Validators.max(100000000)]],
    start: [null as Date | null],
    end: [null as Date | null],
    type: [null]
  });

  ngOnInit() {
    this.loadTransactions();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadTransactions();
    })
  }

  loadTransactions() {
    const filters = this.filterForm.value;
    const searchTerm = this.searchControl.value!;

    const startIso = filters.start ? new Date(filters.start).toISOString() : undefined;
    const endIso = filters.end ? new Date(filters.end).toISOString() : undefined;

    this._transaction.getHistoryWithFilter(
      this.currentPage,
      this.pageSize,
      filters.type!,
      filters.minAmount!,
      filters.maxAmount!,
      startIso,
      endIso,
      searchTerm
    ).subscribe({
      next: (response) => {
        this.transactions.set(response.content);
        this.totalElements.set(response.totalElements);
        console.log("Transacciones obtenidas: ", response);
      },
      error: err => console.error("Error al obtener las transacciones: ", err)
    });
  }

  applyFilters() {
    this.currentPage = 0;
    this.loadTransactions();

  }

  clearFilters() {
    this.filterForm.reset();
    this.applyFilters();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTransactions();
  }

  onSearch(string: Event) {

  }

  isEntry(t: any): boolean {
    if (t.transactionType === 'DEPOSIT') return true;

    return t.transactionType === 'TRANSFER' && t.counterpartyAccountId === this.userAccount()?.id;
  }

  toggleFilters() {
    this.isFiltersOpen = !this.isFiltersOpen;
  }

  goTransaction(id: number) {
    this._router.navigate(['transaction', id]);
  }


}
