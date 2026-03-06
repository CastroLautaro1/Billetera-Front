import { Component, inject } from '@angular/core';
import { UserService } from '../../core/services/user-service';
import { AccountService } from '../../core/services/account-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { NotificationService } from '../../core/services/notification-service';

@Component({
  selector: 'app-user-modal-component',
  imports: [MatTabsModule, MatDialogModule, MatIcon],
  templateUrl: './user-modal-component.html',
  styleUrl: './user-modal-component.css',
})
export class UserModalComponent {
  private _user = inject(UserService);
  private _account = inject(AccountService);
  private _notify = inject(NotificationService);

  userData = toSignal(
    this._user.getProfile(),
    { initialValue : undefined }
  );

  accountData = toSignal(
    this._account.getProfile(),
    { initialValue : undefined }
  );

  // En tu componente del modal
  copyToClipboard(text: string | undefined, label: string) {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      this._notify.success(`${label} copiado al portapapeles`)
      // Aquí podrías disparar un matSnackBar para avisar
      console.log(`${label} copiado al portapapeles`);
    });
  }

}
