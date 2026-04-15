import { Routes } from '@angular/router';
import { HomeComponent } from './features/home-component/home-component';
import { AuthComponent } from './features/auth-component/auth-component';
import { TransferContactComponent } from './features/transfer-contact-component/transfer-contact-component';
import { TransferAmountComponent } from './features/transfer-amount-component/transfer-amount-component';
import { TransferSuccessComponent } from './features/receipt-component/transfer-success-component';
import { HistoryComponent } from './features/history-component/history-component';
import { UserModalComponent } from './features/user-modal-component/user-modal-component';
import { TransactionComponent } from './features/transaction-component/transaction-component';
import { EditProfileComponent } from './features/edit-profile-component/edit-profile-component';
import { authGuard } from './core/guards/auth-guard';
import { PaymentSuccess } from './features/wallet/payment-success/payment-success';
import { PaymentPending } from './features/wallet/payment-pending/payment-pending';
import { PaymentError } from './features/wallet/payment-error/payment-error';
import { Deposit } from './features/wallet/deposit/deposit';

export const routes: Routes = [
    { path: 'auth', component: AuthComponent },
    // Rutas protegidas
    {
        path: '',
        canActivate: [authGuard], // Se aplica a todas las de abajo
        canActivateChild: [authGuard],
        children: [
            { path: '', component: HomeComponent },
            { path: 'transfer-contact', component: TransferContactComponent },
            { path: 'transfer-amount/:id', component: TransferAmountComponent },
            { path: 'transfer-success/:id', component: TransferSuccessComponent },
            { path: 'history', component: HistoryComponent },
            { path: 'transaction/:id', component: TransactionComponent },
            { path: 'edit-profile', component: EditProfileComponent },
            { path: 'payment-success', component: PaymentSuccess },
            { path: 'payment-pending', component: PaymentPending },
            { path: 'payment-error', component: PaymentError },
            { path: 'deposit', component: Deposit }
        ]
    },
    { path: '**', redirectTo: '' } 

];
