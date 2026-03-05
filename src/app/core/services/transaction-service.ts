import { HttpClient, HttpParams } from '@angular/common/http';
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

  downloadReceiptPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${id}/receipt`, {
      responseType : 'blob'
    });
  }

  getHistoryWithFilter(
    page: number,
    size: number,
    type?: string,
    minAmount?: number,
    maxAmount?: number,
    start?: string,
    end?: string
  ): Observable<Page<Transaction>>{

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if(type) {
      params = params.set('type', type);
    }
    if(minAmount != null) {
      params = params.set('minAmount', minAmount.toString());
    }
    if(maxAmount != null) {
      params = params.set('maxAmount', maxAmount.toString());
    }
    if(start) {
      params = params.set('start', start);
    }
    if(end) {
      params = params.set('end', end);
    }

    return this.http.get<Page<Transaction>>(`${this.API_URL}/history`, { params });
  }

}
