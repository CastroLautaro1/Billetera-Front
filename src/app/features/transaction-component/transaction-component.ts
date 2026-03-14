import { Component, inject, LOCALE_ID } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TransactionService } from '../../core/services/transaction-service';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { FileDownloadService } from '../../core/services/file-download-service';

@Component({
  selector: 'app-transaction-component',
  imports: [MatIcon, DatePipe],
  providers: [{
    provide: LOCALE_ID, useValue: 'es-AR'
  }],
  templateUrl: './transaction-component.html',
  styleUrl: './transaction-component.css',
})
export class TransactionComponent {
  private _transaction = inject(TransactionService);
  private _account = inject(AccountService);
  private _route = inject(ActivatedRoute);
  private _fileDownload = inject(FileDownloadService);

  isDownloading = false;

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

  userAccount = toSignal(
    this._account.getProfile(),
    { initialValue : undefined }
  );

  downloadReceipt() {
    const txId = this.transaction()?.id;
    
    if (!txId) {
      console.error('No hay ID de transacción para descargar');
      return;
    }

    this.isDownloading = true;

    this._transaction.downloadReceiptPdf(txId).subscribe({
      next: (blob: Blob) => {
        this._fileDownload.downloadBlobAsFile(blob, `Comprobante_Oran_${txId}.pdf`);
      },
      error: (error) => {
        console.error('Error al descargar el comprobante desde el servidor', error);
      },
      complete: () => {
        this.isDownloading = false;
      }
    });
  }

  formmatedReference(id: number | undefined): string {
    if (!id) return 'REF-PENDIENTE';
  
    const paddedId = id.toString().padStart(8, '0');
    return `REF-${paddedId}`;
  }

  isEntry(): boolean {
    if (this.transaction()?.transactionType === 'DEPOSIT') return true;

    return this.transaction()?.transactionType === 'TRANSFER' && this.transaction()?.counterpartyAccountId === this.userAccount()?.id;
  }

  // Determina si el Usuario logueado es el origen o la contraparte de la transaccion
  isOrigin(accountId: number) {
    return this.userAccount()?.id === accountId;
  }
}
