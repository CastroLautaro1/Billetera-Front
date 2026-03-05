import { Routes } from '@angular/router';
import { HomeComponent } from './features/home-component/home-component';
import { AuthComponent } from './features/auth-component/auth-component';
import { TransferContactComponent } from './features/transfer-contact-component/transfer-contact-component';
import { TransferAmountComponent } from './features/transfer-amount-component/transfer-amount-component';
import { ReceiptComponent } from './features/receipt-component/receipt-component';
import { HistoryComponent } from './features/history-component/history-component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'auth', component: AuthComponent},
    {path: 'transferContact', component: TransferContactComponent},
    {path: 'transferAmount/:id', component: TransferAmountComponent},
    {path: 'receipt/:id', component: ReceiptComponent},
    {path: 'history', component: HistoryComponent}
];
