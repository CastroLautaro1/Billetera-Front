import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TransactionService } from '../../core/services/transaction-service';
import { filter, map, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AccountService } from '../../core/services/account-service';
import { CommonModule } from '@angular/common';
import { FileDownloadService } from '../../core/services/file-download-service';


@Component({
  selector: 'app-transfer-success-component',
  imports: [CommonModule, MatIcon, RouterLink],
  templateUrl: './transfer-success-component.html',
  styleUrl: './transfer-success-component.css',
})
export class TransferSuccessComponent {

  private _route = inject(ActivatedRoute);
  private _transaction = inject(TransactionService);
  private _account = inject(AccountService);
  private _fileDownload = inject(FileDownloadService);

  isDownloading = signal<boolean>(false);

  private transactionId$ = this._route.paramMap.pipe(
      map(param => param.get('id')),
      map(id => id ? Number(id) : null),
      filter((id): id is number => id !== null)
  );

  transactionData = toSignal(
    this.transactionId$.pipe(
      switchMap(id => this._transaction.getById(id))
    ),
    { initialValue : undefined }
  );

  originAccount = toSignal(
    toObservable(this.transactionData).pipe(
      filter(tx => tx?.id !== undefined && tx.id !== null),
      switchMap(tx => this._account.getAccountPublicData(tx?.originAccountId!))
    ),
    { initialValue : undefined }
  );

  counterpartyAccount = toSignal(
    toObservable(this.transactionData).pipe(
      filter(tx => tx?.id !== undefined && tx.id !== null),
      switchMap(tx => this._account.getAccountPublicData(tx?.counterpartyAccountId!))
    ),
    { initialValue : undefined }
  );

  downloadPDF() {
    const txId = this.transactionData()?.id;
    
    if (!txId) {
      console.error('No hay ID de transacción para descargar');
      return;
    }

    this.isDownloading.set(true);

    this._transaction.downloadReceiptPdf(txId).subscribe({
      next: (blob: Blob) => {
        this._fileDownload.downloadBlobAsFile(blob, `Comprobante_Oran_${txId}.pdf`);
      },
      error: (error) => {
        console.error('Error al descargar el comprobante desde el servidor', error);
      },
      complete: () => {
        this.isDownloading.set(false);
      }
    });
  }

}
