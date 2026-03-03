import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Transaction } from '../../shared/models/Transaction';
import { Page } from '../../shared/models/Page';
import { TransactionDTO } from '../../shared/models/TransactionDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/transaction';

  /* Obtiene el historial de las transacciones realizadas por el usuario logueado */
  getHistory(page: number = 0, size: number = 10) {
    return this.http.get<Page<Transaction>>(`${this.API_URL}/history?page=${page}&size=${size}`);
  }

  makeTransfer(transferData: TransactionDTO) {
    return this.http.post<Transaction>(`${this.API_URL}/transfer`, transferData);
  }

  getById(transactionId: number) {
    return this.http.get<Transaction>(`${this.API_URL}/${transactionId}`);
  }

  donwloadReceiptPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${id}/receipt`, {
      responseType : 'blob'
    });
  }

}
