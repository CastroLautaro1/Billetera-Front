import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../core/services/transaction-service';
import { filter, map, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AccountService } from '../../core/services/account-service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

// Configuración obligatoria para que pdfmake pueda usar sus fuentes por defecto
const pdf = pdfMake as any;
const fonts = pdfFonts as any;
pdf.vfs = fonts.pdfMake ? fonts.pdfMake.vfs : fonts.vfs;

@Component({
  selector: 'app-receipt-component',
  imports: [MatIcon],
  templateUrl: './receipt-component.html',
  styleUrl: './receipt-component.css',
})
export class ReceiptComponent {

  private _route = inject(ActivatedRoute);
  private _transaction = inject(TransactionService);
  private _account = inject(AccountService);
  private _router = inject(Router);

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

  
  shareReceipt() {

  }

  
  downloadPDF() {
    const txId = this.transactionData()?.id;
    
    if (!txId) {
      console.error('No hay ID de transacción para descargar');
      return;
    }

    this.isDownloading.set(true);

    this._transaction.downloadReceiptPdf(txId).subscribe({
      next: (blob: Blob) => {
        // 1. Creamos una URL temporal en el navegador para el archivo (Blob)
        const fileUrl = window.URL.createObjectURL(blob);

        // 2. Creamos un elemento <a> invisible HTML
        const anchor = document.createElement('a');
        anchor.href = fileUrl;
        
        // 3. Le ponemos el nombre con el que se va a guardar en la PC del usuario
        anchor.download = `Comprobante_Oran_${txId}.pdf`;

        // 4. Lo agregamos al DOM, simulamos el click y lo borramos rápidamente
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        
        // 5. Liberamos la memoria de la URL temporal
        window.URL.revokeObjectURL(fileUrl);
      },
      error: (error) => {
        console.error('Error al descargar el comprobante desde el servidor', error)
        // Acá podrías mostrar un cartelito (SnackBar) diciendo "Error al descargar"
      },
      complete: () => {
        // Apagamos el spinner de carga
        this.isDownloading.set(false);
      }
    });
  }

  goHome() {
    this._router.navigate(['']);
  }

}
