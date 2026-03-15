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

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'auth', component: AuthComponent},
    {path: 'transferContact', component: TransferContactComponent},
    {path: 'transferAmount/:id', component: TransferAmountComponent},
    {path: 'transfer-success/:id', component: TransferSuccessComponent},
    {path: 'history', component: HistoryComponent},
    {path: 'transaction/:id', component: TransactionComponent},
    {path: 'editProfile', component: EditProfileComponent}
];
