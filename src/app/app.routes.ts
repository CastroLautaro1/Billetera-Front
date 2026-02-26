import { Routes } from '@angular/router';
import { HomeComponent } from './features/home-component/home-component';
import { AuthComponent } from './features/auth-component/auth-component';
import { TransferContactComponent } from './features/transfer-contact-component/transfer-contact-component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'auth', component: AuthComponent},
    {path: 'transferContact', component: TransferContactComponent}
];
